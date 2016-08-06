/// <reference path="../typings/main/index.d.ts" />

import * as fs from 'fs';
import * as R from 'ramda';
const parse = require('csv-parse/lib/sync');

import {Question, Candidate, Answer, AnswerMap, ReasonMap, InitialData, ANSWER} from '../app/app-state-interfaces';

type Row = string[];

function parseQuestions(fileContent: string): Question[] {
  const questionRows: Row[] = parse(fileContent);
  return questionRows.slice(1).map(row => ({
    id: row[0],
    initiative: row[3] || '',
    initiativeAnswer: ANSWER.yes,
    initiativeReason: row[2],
    text: row[1],
  }));
}


// in answers.csv
enum AnswerFileCols {
  NAME, PARTY, REGION, QUESTION_NUMBER, ANSWER, REASON
}

const ANSWER_MAP: { [asnwer: string]: Answer } = {
  'ja': 'yes',
  'nein': 'no',
  'neutral': 'no'
};

const toAnswer = (inputAnswer: string): Answer => ANSWER_MAP[inputAnswer.toLowerCase()] || 'neutral';

function getAnswerMapFromRows(answerRows: string[][]): AnswerMap {
  const pairs = answerRows.map((answerRow: string[]) =>
    [answerRow[AnswerFileCols.QUESTION_NUMBER], toAnswer(answerRow[AnswerFileCols.ANSWER])] as [string, Answer]
  );
  return R.fromPairs(pairs);
}

function getReasonsMapFromRows(answerRows: Row[]): ReasonMap {
  const pairs = answerRows.map((answerRow: string[]) =>
    [answerRow[AnswerFileCols.QUESTION_NUMBER], answerRow[AnswerFileCols.REASON]] as [string, string]
  );
  return R.fromPairs(pairs);
}

function parseCandidateAnswers(fileContent: string): Candidate[] {
  const rows: string[][] = parse(fileContent);
  const rowsByCandidate = R.groupBy(row => row[AnswerFileCols.NAME], rows.slice(1));
  const candidateRowPairs: [string, Row[]][] = R.toPairs(rowsByCandidate) as any;
  return candidateRowPairs.map((candidateAndAnswerRows: [string, Row[]]) => {
    const candidateName = candidateAndAnswerRows[0];
    const answerRows = candidateAndAnswerRows[1];
    const oneRow = answerRows[0];
    return {
      answers: getAnswerMapFromRows(answerRows),
      id: candidateName,
      name: candidateName,
      party: oneRow[AnswerFileCols.PARTY],
      reasons: getReasonsMapFromRows(answerRows),
      region: oneRow[AnswerFileCols.REGION]
    };
  });
}


const questions = parseQuestions(fs.readFileSync('data/questions.csv', 'utf8'));
const candidates = parseCandidateAnswers(fs.readFileSync('data/answers.csv', 'utf8'));

const initialData: InitialData = { questions, candidates };
console.log(JSON.stringify(initialData, null, 2));

