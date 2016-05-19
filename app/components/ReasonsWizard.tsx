/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as classNames from 'classnames';
import { browserHistory } from 'react-router';


import { Answer, ANSWER, Question } from '../app-state';
import { ROUTES } from '../routes';
import * as AppState from '../app-state';
import {QuestionsWizard} from './QuestionsWizard';



const {skipped, yes, no, neutral} = ANSWER;

export class ReasonsWizard extends QuestionsWizard {
  onPrevButton = () => {
    this.gotoQuestion(this.state.questionIndex - 1);
  };

  onNextButton = () => {
    this.gotoQuestion(this.state.questionIndex + 1);
  };

  render() {
    const questionIndex = this.state.questionIndex;
    const question = this.question();
    const questions = AppState.getState().questions;

    if (!question) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <p className='initiative'>Initiative: {question.initiative}</p>
        <p className='questionText'>{question.text}</p>
        {questionIndex > 0 ?
          <button className='linkButton prevButton' onClick={this.onPrevButton}>Vorherige Frage</button>
          : null}
        {questionIndex < questions.length - 1 ?
          <button className='linkButton nextButton' onClick={this.onNextButton}>Nächste Frage</button>
          : null}
        {this.renderQuestionLinks() }
      </div>
    );
  }
}