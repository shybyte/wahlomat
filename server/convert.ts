/// <reference path="../typings/main/index.d.ts" />

import * as fs from 'fs';
import * as R from 'ramda';
const parse = require('csv-parse/lib/sync');

import {Question, Party, Answer, AnswerMap, ReasonMap, InitialData} from '../app/app-state-interfaces';

const fileContent = fs.readFileSync('data/data.csv', 'utf8');
const rows = parse(fileContent);

const header = rows[0];
const body = rows.slice(1);

const ANSWER_MAP = {
  'zustimmung': 'yes',
  'ablehnung': 'no',
  'keine zustimmung': 'no'
};

const toAnswer = (inputAnswer): Answer => ANSWER_MAP[inputAnswer.toLowerCase()] || 'neutral';

const questions = body.map((row, i): Question => {
  return {
    id: i.toString(),
    initiative: row[0],
    initiativeAnswer: toAnswer(row[2]),
    initiativeReason: row[3],
    text: row[1],
  };
});

const partyStartRow = 4;
const parties = R.splitEvery(2, header.slice(partyStartRow)).map((answerReasonTupel: [string, string], partyIndex): Party => {
  const name = answerReasonTupel[0].replace(/\w+\s+/, '');
  return {
    answers: R.fromPairs(body.map((row, i) =>
      [i.toString(), toAnswer(row[partyStartRow + partyIndex * 2])]
    )) as AnswerMap,
    id: name.toLowerCase(),
    name,
    reasons: R.fromPairs(body.map((row, i) =>
      [i.toString(), row[partyStartRow + partyIndex * 2 + 1]]
    )) as ReasonMap
  };
});

const initialData: InitialData = { questions, parties };
console.log(JSON.stringify(initialData, null, 2));

