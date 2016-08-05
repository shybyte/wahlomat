/// <reference path="../typings/main/index.d.ts" />

import * as fs from 'fs';
import * as R from 'ramda';
const parse = require('csv-parse/lib/sync');

import {Question, Candidate, Answer, AnswerMap, ReasonMap, InitialData, ANSWER} from '../app/app-state-interfaces';

type Row = string[];

function parseQuestions(fileContent: string): Question[] {
  const questionRows: Row[] = parse(fileContent);
  return questionRows.slice(0).map(row => ({
    id: row[0],
    initiative: row[3],
    initiativeAnswer: ANSWER.yes,
    initiativeReason: row[3],
    text: row[1],
  }));
}


// in answers.csv
const QUESTION_NUMBER_COL = 3;
const ANSWER_COL = 4;
const REASONS_COL = 5;

const ANSWER_MAP: { [asnwer: string]: Answer } = {
  'ja': 'yes',
  'nein': 'no',
  'neutral': 'no'
};

const toAnswer = (inputAnswer: string): Answer => ANSWER_MAP[inputAnswer.toLowerCase()] || 'neutral';

function getAnswerMapFromRows(answerRows: string[][]): AnswerMap {
  const pairs = answerRows.map((answerRow: string[]) =>
    [answerRow[QUESTION_NUMBER_COL], toAnswer(answerRow[ANSWER_COL])] as [string, Answer]
  );
  return R.fromPairs(pairs);
}

function getReasonsMapFromRows(answerRows: Row[]): ReasonMap {
  const pairs = answerRows.map((answerRow: string[]) =>
    [answerRow[QUESTION_NUMBER_COL], answerRow[REASONS_COL]] as [string, string]
  );
  return R.fromPairs(pairs);
}

function parseCandidateAnswers(fileContent: string): Candidate[] {
  const NAME_COL = 0;
  const rows: string[][] = parse(fileContent);
  const rowsByCandidate = R.groupBy(row => row[NAME_COL], rows.slice(1));
  const candidateRowPairs: [string, Row[]][] = R.toPairs(rowsByCandidate) as any;
  return candidateRowPairs.map((candidateAndAnswerRows: [string, Row[]]) => {
    return {
      answers: getAnswerMapFromRows(candidateAndAnswerRows[1]),
      id: candidateAndAnswerRows[0],
      name: candidateAndAnswerRows[0],
      reasons: getReasonsMapFromRows(candidateAndAnswerRows[1])
    };
  });
}


const questions = parseQuestions(fs.readFileSync('data/questions.csv', 'utf8'));
const candidates = parseCandidateAnswers(fs.readFileSync('data/answers.csv', 'utf8'));

const initialData: InitialData = { questions, candidates };
console.log(JSON.stringify(initialData, null, 2));

