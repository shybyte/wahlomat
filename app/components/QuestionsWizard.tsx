/// <reference path="../../typings/main.d.ts" />

import * as React from 'react';
import * as classNames from 'classnames';
import { browserHistory } from 'react-router';


import { Answer, ANSWER, Question } from '../app-state';
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
    const s = this.state;
    const appState = AppState.getState();
    const answers = appState.answers;
    const question = this.question();
    if ((answer !== skipped || !answers[question.id])) {
      AppState.setAnswer(question.id, answer);
    }
    setTimeout(() => {
      const nextQuestionIndex = s.questionIndex + 1;
      if (nextQuestionIndex < appState.questions.length) {
        this.gotoQuestion(nextQuestionIndex);
      } else {
        browserHistory.push(ROUTES.weighting);
        AppState.setQuestionsDone();
      }
    }, 200);
  };

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

    const buttonClass = (a: Answer) => classNames({ selected: AppState.getState().answers[question.id] === a });
    return (
      <div>
        <h2 className='title'>{question.title}</h2>
        <p className='title'>{question.text}</p>
        <button className='linkButton skipButton' onClick={() => this.onAnswer(skipped) }>These überspringen</button>
        <div className='buttonGroup'>
          <button className={buttonClass(yes) } onClick={() => this.onAnswer(yes) }>stimme  zu</button>
          <button className={buttonClass(neutral) } onClick={() => this.onAnswer(neutral) }>neutral</button>
          <button className={buttonClass(no) } onClick={() => this.onAnswer(no) }>stimme nicht zu</button>
        </div>
        {this.renderQuestionLinks() }
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
