/// <reference path="../typings/main/globals/mongodb/index.d.ts" />

import * as mongodb from 'mongodb';

import {Vote} from '../app/app-state';

const VOTE_COLLECTION = 'vote';

const server = new mongodb.Server('localhost', 27017, { reconnectTries: 3 });
const db = new mongodb.Db('wahlomat', server, { w: 1 });

db.open().then(() => {
  console.log('Connected to mongodb');
}, error => {
  console.error('Error connecting to mongodb.', error);
});


export function saveVote(vote: Vote) {
  db.collection(VOTE_COLLECTION, (err, voteCollection) => {
    if (err) {
      console.error(err);
    }
    voteCollection.insert(vote);
  });
}



