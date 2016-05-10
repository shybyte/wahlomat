/// <reference path="../../typings/main.d.ts" />

import * as React from 'react';
import { DataBase, Answer, AnswerMap, ANSWER, Question } from '../database';
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
    const s = this.state;
    const answers = s.answers;
    const question = this.question();
    this.setState({
      answers: (answer !== skipped || !answers[question.id]) ?
        replaceEntry(s.answers, question.id, answer)
        : s.answers,
    });
    setTimeout(() => {
      this.gotoQuestion((s.questionIndex + 1) % this.props.questions.length);
    }, 200);
  };

  question = () => this.props.questions[this.state.questionIndex];

  gotoQuestion = (questionIndex: number) => {
    this.setState({ questionIndex });
  };

  hasNonSkippedAnswer = (q: Question) => {
    const answer = this.state.answers[q.id];
    return answer && answer !== skipped;
  }

  render() {
    const s = this.state;
    const question = this.question();
    const buttonClass = (a: Answer) => classNames({ selected: s.answers[question.id] === a });

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
          this.props.questions.map((question, i) => (
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
