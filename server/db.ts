/// <reference path="../typings/main/globals/mongodb/index.d.ts" />

import * as mongodb from 'mongodb';
import {} from 'mongodb';

import {Vote} from '../app/app-state-interfaces';

const VOTE_COLLECTION = 'vote';
const TOKEN_COLLECTION = 'token';

interface VoteDBEntry extends Vote {
  ip: string;
  userAgent: string;
  date: Date;
}

interface TokenEntry {
  token: string;
  ip: string;
  userAgent: string;
  date: Date;
}


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

/**
 * @return the old Vote if there is any
 */
export async function saveVote(vote: VoteDBEntry): Promise<VoteDBEntry | null> {
  const tokenCollection = db.collection(TOKEN_COLLECTION);
  const token = await tokenCollection.findOne({ token: vote.sessionId });
  if (!token) {
    console.log('Invalid sessionId in vote', vote);
    return null;
  }

  const voteCollection = db.collection(VOTE_COLLECTION);
  const oldVote = await voteCollection.findOne({ clientToken: vote.clientToken });
  if (oldVote) {
    voteCollection.deleteOne(oldVote);
  }
  voteCollection.insertOne(vote);
  return oldVote;
}

export async function forEachVote(f: (vote: VoteDBEntry) => void) {
  const cursor = db.collection(VOTE_COLLECTION).find();
  cursor.forEach(f, () => {
    cursor.close();
  });
}

export function saveToken(tokenEntry: TokenEntry) {
  return db.collection(TOKEN_COLLECTION).insertOne(tokenEntry);
}

/**
 * Must be called first.
 */
export async function init() {
  await openDB();
}
