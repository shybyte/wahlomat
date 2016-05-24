/// <reference path="../typings/main/index.d.ts" />

import * as R from 'ramda';

import {ANSWER, Party, AnswerMap, WeightMap, NumberMap, Answer } from './app-state-interfaces';
import {QuestionStats, Weight, Stats} from '../app/app-state-interfaces';


const ANSWER_TO_NUMBER: { [key: string]: number } = {
  [ANSWER.no]: -1,
  [ANSWER.neutral]: 0,
  [ANSWER.yes]: 1,
};

export function answerToNumber(answer: Answer) {
  return ANSWER_TO_NUMBER[answer] || 0;
}

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
    const myValue = answerToNumber(answerMap[id]);
    const partyValue = answerToNumber(party.answers[id]);
    return Math.abs(myValue - partyValue) * weight(id);
  });
  return 1 - (R.sum(deltas) / maxDeltaSum);
}

export function getSimilarities(answerMap: AnswerMap, weights: WeightMap, parties: Party[]): NumberMap {
  const pairs = parties.map(party => [party.id, getSimilarity(answerMap, weights, party)] as [string, number]);
  return R.fromPairs(pairs);
}


export function getQuestionStats(stats: Stats, questionId: string): QuestionStats {
  return stats.questionsStats[questionId] || {
    answerStats: {
      [ANSWER.yes]: 0,
      [ANSWER.no]: 0,
      [ANSWER.neutral]: 0,
      [ANSWER.skipped]: 0,
    },
    weightStats: {
      [Weight.NORMAL]: 0,
      [Weight.IMPORTANT]: 0,
    },
  };
}
