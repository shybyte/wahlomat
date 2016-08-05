import {Answer, AnswerMap, WeightMap, Weight,
  StoredAppState, AppState} from './app-state-interfaces';

import * as webService from './web-service';
import {swap, loadObjectFromLocalStorage, extend, replaceEntry, assign} from './utils';

/* Store  */

const LOCAL_STORAGE_KEY = 'wahlomat';

let restoredAppState: StoredAppState = loadObjectFromLocalStorage(LOCAL_STORAGE_KEY, {
  answers: {} as AnswerMap,
  questionsDone: false,
  sessionId: Math.random().toString(36).substring(7),
  weights: {} as WeightMap,
});

let appState: AppState = extend(restoredAppState, {
  candidates: [],
  initialized: false,
  questions: [],
});

type Subscriber = (appState: AppState) => void;

const subscribers: Subscriber[] = [];

export function subscribe(subscriber: Subscriber) {
  subscribers.push(subscriber);
  subscriber(appState);
}

function swapState(changeState: (appState: AppState) => void) {
  setState(swap(appState, changeState));
}

function setState(newAppState: AppState) {
  appState = newAppState;
  if (appState.initialized) {
    storeAppState();
  }
  subscribers.forEach(subscriber => {
    subscriber(appState);
  });
}

function storeAppState() {
  const storedState: StoredAppState = {
    answers: appState.answers,
    questionsDone: appState.questionsDone,
    savedVote: appState.savedVote,
    sessionId: appState.sessionId,
    weights: appState.weights,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedState));
}


export function getState() {
  return appState;
}

export function getCurrentVote() {
  return {
    answers: appState.answers,
    sessionId: appState.sessionId,
    weights: appState.weights,
  };
}

/* Actions */

export function init() {
  webService.loadData().then(initialData => {
    setState(assign(appState, initialData));
    swapState(s => {
      s.initialized = true;
    });
  });
}

export function setQuestionsDone() {
  swapState(s => {
    s.questionsDone = true;
  });
}

export function setAnswer(questionId: string, answer: Answer) {
  swapState(ast => {
    ast.answers = replaceEntry(ast.answers, questionId, answer);
  });
}

export function setWeight(questionId: string, weight: Weight) {
  swapState(ast => {
    ast.weights = replaceEntry(ast.weights, questionId, weight);
  });
}

export function saveVote() {
  const vote = getCurrentVote();
  webService.saveVote(vote).then(() => {
    swapState(ast => {
      ast.savedVote = vote;
    });
  });

}

