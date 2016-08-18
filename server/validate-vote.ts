import * as R from 'ramda';
import {Vote, AnswerMap, WeightMap, ANSWER} from '../app/app-state-interfaces';


function isObject(obj: Object) {
  return obj && typeof obj === 'object';
}

const possibleAnswers = R.keys(ANSWER);

function isAnswerMap(answers: AnswerMap) {
  if (!isObject(answers)) {
    return false;
  }
  return R.values(answers).every(a => R.contains(a, possibleAnswers));
}


const possibleWeights = [0, 1, 2];

function isWeightMap(weights: WeightMap) {
  if (!isObject(weights)) {
    return false;
  }
  return R.values(weights).every(a =>
    typeof a === 'number' && R.contains(a, possibleWeights)
  );
}

function isString(s: string) {
  return typeof s === 'string';
}

export function isVoteValid(vote: Vote) {
  return vote && isAnswerMap(vote.answers) &&
    isWeightMap(vote.weights) && isString(vote.sessionId) && isString(vote.clientToken);
}
