
import {Vote} from './app-state-interfaces';
declare const require: (name: String) => any;
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {InitialData} from './app-state-interfaces.ts';


export function loadData(): Promise<InitialData> {
  return fetch('data/data.json')
    .then(response => response.json() as Promise<InitialData>);
};


export function saveVote(vote: Vote): Promise<any> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch('vote', {
    body: JSON.stringify(vote),
    headers,
    method: 'POST',
  }).then(response => response.json() as Promise<any>);
};
