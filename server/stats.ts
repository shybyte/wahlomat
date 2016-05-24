import * as db from './db';
import {Stats, QuestionStats, ANSWER, Weight, Vote} from '../app/app-state-interfaces';

const stats: Stats = {
  questionsStats: {}
};

function getQuestionStats(questionId: string): QuestionStats {
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

function modifyQuestionStats(questionId: string, f: (questionStats: QuestionStats) => void) {
  const questionStats = getQuestionStats(questionId);
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
      questionStats.answerStats[answer] += 1;
    });
  });
  Object.keys(vote.weights).forEach(questionId => {
    modifyQuestionStats(questionId, questionStats => {
      const weight = vote.weights[questionId];
      questionStats.weightStats[weight] += 1;
    });
  });
}


export const getStats = () => stats;


