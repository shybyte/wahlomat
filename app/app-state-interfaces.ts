
export interface Question {
  id: string;
  initiative: string;
  text: string;
  initiativeAnswer: Answer;
  initiativeReason: string;
}

export type Answer = 'yes' | 'no' | 'neutral' | 'skipped';
export const ANSWER = {
  neutral: 'neutral' as Answer,
  no: 'no' as Answer,
  skipped: 'skipped' as Answer,
  yes: 'yes' as Answer,
};

export type AnswerMap = { [querstionId: string]: Answer };
export type WeightMap = { [querstionId: string]: Weight };
export type ReasonMap = { [querstionId: string]: string };
export type NumberMap = { [id: string]: number };

export interface InitialData {
  questions: Question[];
  candidates: Candidate[];
}

export enum Weight {
  NORMAL = 1,
  IMPORTANT = 2
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  region: string;
  answers: AnswerMap;
  reasons: ReasonMap;
}

export interface Vote {
  answers: AnswerMap;
  weights: WeightMap;
  sessionId: string;
}


export interface StoredAppState extends Vote {
  questionsDone: boolean;
  savedVote?: Vote;
}

export interface AppState extends StoredAppState {
  questions: Question[];
  candidates: Candidate[];
  initialized: boolean;
}

/**
 * key: Answer
 */
export type AnswerStats = { [answer: string]: number };

/**
 * key: Weight
 */
export type WeightStats = { [weight: number]: number };

export interface QuestionStats {
  answerStats: AnswerStats;
  weightStats: WeightStats;
  interest: number;
}

export type QuestionsStats = { [questionId: string]: QuestionStats };

export interface Stats {
  questionsStats: QuestionsStats;
}

