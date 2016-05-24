/// <reference path="../typings/main/globals/mongodb/index.d.ts" />

import * as mongodb from 'mongodb';

import {Vote} from '../app/app-state-interfaces';

const VOTE_COLLECTION = 'vote';

const server = new mongodb.Server('localhost', 27017, { reconnectTries: 3 });
const db = new mongodb.Db('wahlomat', server, { w: 1 });

async function openDB() {
  try {
    await db.open();
    console.log('Connected to mongodb');
  } catch (error) {
    console.error('Error connecting to mongodb.', error);
  }
}

export function saveVote(vote: Vote) {
  return db.collection(VOTE_COLLECTION).insert(vote);
}

export async function forEachVote(f: (vote: Vote) => void) {
  const cursor = db.collection(VOTE_COLLECTION).find();
  cursor.forEach(f, () => {
    cursor.close();
  });
}

/**
 * Must be called first.
 */
export async function init() {
  await openDB();
}
