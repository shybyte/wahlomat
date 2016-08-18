import {Answer, AnswerMap, WeightMap, RegionMap, Weight,
  StoredAppState, AppState, Region} from './app-state-interfaces';

import * as webService from './web-service';
import * as R from 'ramda';
import {swap, loadObjectFromLocalStorage, extend, replaceEntry, assign} from './utils';

declare const clientToken: string;

/* Store  */

const LOCAL_STORAGE_KEY = 'wahlomat';

let restoredAppState: StoredAppState = assign(loadObjectFromLocalStorage(LOCAL_STORAGE_KEY, {
  answers: {} as AnswerMap,
  clientToken: clientToken,
  questionsDone: false,
  sessionId: clientToken,
  weights: {} as WeightMap,
}), { sessionId: clientToken });



let appState: AppState = extend(restoredAppState, {
  candidates: [],
  initialized: false,
  questions: [],
  regions: {} as RegionMap
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
    clientToken: appState.clientToken,
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

export function getSortedRegions() {
  return R.sortBy(r => r.name, R.values(appState.regions));
}

export function getCandidatesInRegion(region: Region) {
  return appState.candidates.filter(c => R.contains(region.id, c.regions));
}


export function getCurrentVote() {
  return {
    answers: appState.answers,
    clientToken: appState.clientToken,
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

