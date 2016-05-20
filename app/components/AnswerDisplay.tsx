/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';
import * as classNames from 'classnames';

import { Answer, ANSWER } from '../app-state';

const TRANSLATION = {
  [ANSWER.yes]: 'Ja',
  [ANSWER.no]: 'Nein',
  [ANSWER.neutral]: 'Neutral',
  [ANSWER.skipped]: '',
}

export const AnswerDisplay = ({answer = ANSWER.skipped}) => (
  <span className={'answer-' + answer}>{ TRANSLATION[answer]}</span >
);




