declare const require: (name: String) => any;
require('es6-promise').polyfill();
require('isomorphic-fetch');


export interface Question {
  id: string;
  title: string;
  text: string;
}

export type Answer = 'yes'| 'no' | 'neutral' | 'skipped';

export type AnswerMap = {[querstionId: string]: Answer};

export interface DataBase {
  questions: Question[];
}

export function loadData(): Promise<DataBase> {
  return fetch('data/data.json')
    .then(response => response.json() as Promise<DataBase>);
};
