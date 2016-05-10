/// <reference path="../../typings/main.d.ts" />

import * as React from 'react';
import { DataBase, Answer, AnswerMap, ANSWER } from '../database';
import { replaceEntry } from '../utils';
import * as classNames from 'classnames';

const {skipped, yes, no, neutral} = ANSWER;

interface AppState {
  questionIndex?: number;
  answers?: AnswerMap;
}

export class App extends React.Component<DataBase, AppState> {
  state = {
    answers: {} as AnswerMap,
    questionIndex: 0
  };

  onAnswer = (answer: Answer) => {
    this.setState({
      answers: replaceEntry(this.state.answers, this.question().id, answer),
      questionIndex: (this.state.questionIndex + 1) % this.props.questions.length,
    });
  };

  question = () => this.props.questions[this.state.questionIndex];

  render() {
    const s = this.state;
    const question = this.question();
    const buttonClass = (a: Answer) => classNames({ selected: s.answers[question.id] === a });

    return (<div>
      <h2 className='title'>{question.title}</h2>
      <p className='title'>{question.text}</p>
      <button className='linkButton skipButton' onClick={() => this.onAnswer(skipped) }>These überspringen</button>
      <div className='buttonGroup'>
        <button className={buttonClass(yes) } onClick={() => this.onAnswer(yes) }>stimme  zu</button>
        <button className={buttonClass(neutral) } onClick={() => this.onAnswer(neutral) }>neutral</button>
        <button className={buttonClass(no) } onClick={() => this.onAnswer(no) }>stimme nicht zu</button>
      </div>
    </div>
    );
  }
}
