/// <reference path="../typings/main/index.d.ts" />

import {ANSWER, Party, AnswerMap, WeightMap, NumberMap } from './app-state';
import * as R from 'ramda';

const ANSWER_TO_NUMBER: { [key: string]: number } = {
  [ANSWER.no]: -1,
  [ANSWER.neutral]: 0,
  [ANSWER.yes]: 1,
};

function getNotSkippedQuestionIDs(answerMap: AnswerMap) {
  return Object.keys(answerMap).filter(id => answerMap[id] !== ANSWER.skipped);
}

function getSimilarity(answerMap: AnswerMap, weights: WeightMap, party: Party): number {
  const myQuestionIds = getNotSkippedQuestionIDs(answerMap);
  const partyQuestionIds = getNotSkippedQuestionIDs(party.answers);
  const commonQuestionIDs = R.intersection(myQuestionIds, partyQuestionIds);
  const weight = (id: string) => weights[id] || 1;
  const maxDeltaSum = R.sum(commonQuestionIDs.map(weight)) * 2;
  const deltas = commonQuestionIDs.map(id => {
    const myValue = ANSWER_TO_NUMBER[answerMap[id]];
    const partyValue = ANSWER_TO_NUMBER[party.answers[id]];
    return Math.abs(myValue - partyValue) * weight(id);
  });
  return 1 - (R.sum(deltas) / maxDeltaSum);
}

export function getSimilarities(answerMap: AnswerMap, weights: WeightMap, parties: Party[]): NumberMap {
  const pairs = parties.map(party => [party.id, getSimilarity(answerMap, weights, party)] as [string, number]);
  return R.fromPairs(pairs);
}
