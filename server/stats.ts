import * as db from './db';
import * as R from 'ramda';
import {Stats, QuestionStats, Vote, ANSWER, Weight} from '../app/app-state-interfaces';
import {getQuestionStats} from '../app/model';

const stats: Stats = {
  questionsStats: {}
};

function modifyQuestionStats(questionId: string, f: (questionStats: QuestionStats) => void) {
  const questionStats = getQuestionStats(stats, questionId);
  f(questionStats);
  stats.questionsStats[questionId] = questionStats;
}

enum CountDirection { ADD = 1, REMOVE = -1 }

const countVote = R.curry((countDirection: CountDirection, vote: Vote) => {
  Object.keys(vote.answers).forEach(questionId => {
    modifyQuestionStats(questionId, questionStats => {
      const answer = vote.answers[questionId];
      const weight = vote.weights[questionId] || Weight.NORMAL;
      questionStats.answerStats[answer] += countDirection;
      questionStats.weightStats[weight] += countDirection;
      if ((answer === ANSWER.yes || answer === ANSWER.no)) {
        questionStats.interest += weight * countDirection;
      }
    });
  });
})

export const addVote = countVote(CountDirection.ADD);
export const removeVote = countVote(CountDirection.REMOVE);

export const getStats = () => stats;


/**
 * Must be callledd after db is available.
 */
export function init() {
  db.forEachVote(addVote);
}