
import {Vote} from './app-state-interfaces';
declare const require: (name: String) => any;
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {InitialData} from './app-state-interfaces.ts';


export async function loadData(): Promise<InitialData> {
  return (await fetch('data/data.json')).json();
};


export async function saveVote(vote: Vote) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch('vote', {
    body: JSON.stringify(vote),
    headers,
    method: 'POST',
  });
  return response.json();
};
