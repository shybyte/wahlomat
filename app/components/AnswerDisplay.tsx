/// <reference path="../../typings/main/index.d.ts" />

import { ANSWER } from '../app-state-interfaces';

const TRANSLATION = {
  [ANSWER.yes]: 'Ja',
  [ANSWER.no]: 'Nein',
  [ANSWER.neutral]: 'Neutral',
  [ANSWER.skipped]: '',
};

export const AnswerDisplay = ({answer = ANSWER.skipped}) => (
  <span className={'answer-' + answer}>{ TRANSLATION[answer]}</span >
);




