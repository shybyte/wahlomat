import * as db from './db';
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

/**
 * Must be callledd after db is available.
 */
export function init() {
  db.forEachVote(addVote);
}

export function addVote(vote: Vote) {
  Object.keys(vote.answers).forEach(questionId => {
    modifyQuestionStats(questionId, questionStats => {
      const answer = vote.answers[questionId];
      const weight = vote.weights[questionId] || Weight.NORMAL;
      questionStats.answerStats[answer] += 1;
      questionStats.weightStats[weight] += 1;
      if ((answer === ANSWER.yes || answer === ANSWER.no)) {
        questionStats.interest += weight;
      }
    });
  });
}


export const getStats = () => stats;


