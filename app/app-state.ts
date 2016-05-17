import {loadData} from './web-service';
import {swap, loadObjectFromLocalStorage, extend, replaceEntry} from './utils';

export interface Question {
  id: string;
  title: string;
  text: string;
}

export type Answer = 'yes' | 'no' | 'neutral' | 'skipped';
export const ANSWER = {
  neutral: 'neutral' as Answer,
  no: 'no' as Answer,
  skipped: 'skipped' as Answer,
  yes: 'yes' as Answer,
};

export type AnswerMap = { [querstionId: string]: Answer };
export type WeightMap = { [querstionId: string]: Weight };

export interface InitialData {
  questions: Question[];
}

export enum Weight {
  NORMAL = 1,
  IMPORTANT = 2
}


interface StoredAppState {
  answers: AnswerMap;
  weights: WeightMap;
  questionsDone: boolean;
}

interface AppState extends StoredAppState {
  questions: Question[];
  initialized: boolean;
}

const LOCAL_STORAGE_KEY = 'wahlomat';

let restoredAppState: StoredAppState = loadObjectFromLocalStorage(LOCAL_STORAGE_KEY, {
  answers: {} as AnswerMap,
  questionsDone: false,
  weights: {} as WeightMap,
});

let appState: AppState = extend(restoredAppState, {
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
  appState = swap(appState, changeState);
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
    weights: appState.weights,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedState));
}


export function getState() {
  return appState;
}


/* Actions */

export function init() {
  loadData().then(dataBase => {
    swapState(s => {
      s.questions = dataBase.questions;
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


