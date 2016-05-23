/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as classNames from 'classnames';
import { hashHistory } from 'react-router';


import { Answer, ANSWER, Question } from '../app-state-interfaces';
import { ROUTES } from '../routes';
import * as AppState from '../app-state';

const {skipped, yes, no, neutral} = ANSWER;

interface WizardState {
  questionIndex?: number;
}

export class QuestionsWizard extends React.Component<{}, WizardState> {
  state = {
    questionIndex: 0
  };

  onAnswer = (answer: Answer) => {
    const appState = AppState.getState();
    const answers = appState.answers;
    const question = this.question();
    if ((answer !== skipped || !answers[question.id])) {
      AppState.setAnswer(question.id, answer);
    }
    this.onAfterAnswer();
  };

  onAfterAnswer() {
    setTimeout(() => {
      const nextQuestionIndex = this.state.questionIndex + 1;
      if (nextQuestionIndex < AppState.getState().questions.length) {
        this.gotoQuestion(nextQuestionIndex);
      } else {
        hashHistory.push(ROUTES.weighting);
        AppState.setQuestionsDone();
      }
    }, 200);
  }

  question = () => AppState.getState().questions[this.state.questionIndex];

  gotoQuestion = (questionIndex: number) => {
    this.setState({ questionIndex });
  };

  hasNonSkippedAnswer = (q: Question) => {
    const answer = AppState.getState().answers[q.id];
    return answer && answer !== skipped;
  }

  render() {
    const question = this.question();

    if (!question) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <p className='initiative'>Initiative: {question.initiative}</p>
        <p className='questionText'>{question.text}</p>
        {this.renderAnswerButtons() }
        <div className='questionNavigation'>
          {this.renderQuestionLinks() }
          <button className='linkButton skipButton' onClick={() => this.onAnswer(skipped) }>Frage überspringen</button>
        </div>
      </div>
    );
  }

  renderAnswerButtons() {
    const question = this.question();
    const buttonClass = (a: Answer) => classNames('answerButton-' + a, {
      selected: AppState.getState().answers[question.id] === a
    });
    return (
      <div className='buttonGroup'>
        <button className={buttonClass(yes) } onClick={() => this.onAnswer(yes) }>stimme  zu</button>
        <button className={buttonClass(neutral) } onClick={() => this.onAnswer(neutral) }>neutral</button>
        <button className={buttonClass(no) } onClick={() => this.onAnswer(no) }>stimme nicht zu</button>
      </div>
    );
  }

  renderQuestionLinks() {
    return (
      <div className='questionLinks'>
        {
          AppState.getState().questions.map((question, i) => (
            <span key={question.id}
              onClick={() => this.gotoQuestion(i) }
              className={classNames('questionLink', {
                hasAnswer: this.hasNonSkippedAnswer(question),
                selected: this.question().id === question.id
              }) }>
              {i}
            </span>
          ))
        }
        <span></span>
      </div>
    );
  }




}
