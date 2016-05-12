import {loadData} from './web-service';
import {swap} from './utils';

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

export interface InitialData {
  questions: Question[];
}


interface AppState {
  questions: Question[];
  initialized: boolean;
  answers: AnswerMap;
}

const LOCAL_STORAGE_KEYS = {
  answers: 'answers'
};

let appState: AppState = {
  answers: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.answers) || '{}'),
  initialized: false,
  questions: [],
};

type Subscriber = (appState: AppState) => void;

const subscribers: Subscriber[] = [];

export function subscribe(subscriber: Subscriber) {
  subscribers.push(subscriber);
  subscriber(appState);
}

export function swapState(changeState: (appState: AppState) => void) {
  appState = swap(appState, changeState);
  localStorage.setItem(LOCAL_STORAGE_KEYS.answers, JSON.stringify(appState.answers));
  subscribers.forEach(subscriber => {
    subscriber(appState);
  });
}

export function getState() {
  return appState;
}

export function init() {
  loadData().then(dataBase => {
    swapState(s => {
      s.questions = dataBase.questions;
      s.initialized = true;
    });
  });
}


