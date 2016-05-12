declare const require: (name: String) => any;
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {InitialData} from './app-state.ts';


export function loadData(): Promise<InitialData> {
  return fetch('/data/data.json')
    .then(response => response.json() as Promise<InitialData>);
};
