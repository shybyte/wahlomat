/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';

import * as AppState from '../app-state';
import {loadStats} from '../web-service';
import {Question, Weight, Stats, ANSWER} from '../app-state-interfaces';
import { AnswerDisplay } from './AnswerDisplay';


interface StatsPageState {
  stats: Stats;
}

const QuestionLine = (props: { question: Question, stats: Stats }) => {
  const {question, stats} = props;
  const questionId = question.id;
  const answerStats = stats.questionsStats[questionId].answerStats;

  return (
    <tr>
      <td>{props.question.text}</td>
      <td>{answerStats[ANSWER.yes]}</td>
      <td>{answerStats[ANSWER.no]}</td>
      <td>{answerStats[ANSWER.neutral]}</td>
      <td>
        {stats.questionsStats[questionId].weightStats[Weight.IMPORTANT]}
      </td>
    </tr>
  );
};

export class StatsPage extends React.Component<{}, StatsPageState> {
  state = {
    stats: null,
  };

  componentDidMount() {
    loadStats().then(stats => {
      this.setState({ stats });
    });
  }

  render() {
    const ast = AppState.getState();
    const s = this.state;
    if (!s.stats) {
      return <div></div>;
    }
    return (
      <div>
        <h2>Statistik</h2>
        <p>Wie haben andere "gewählt"?</p>
        <table>
          <thead>
            <tr>
              <th>Frage</th>
              <th><AnswerDisplay answer={ANSWER.yes}/></th>
              <th><AnswerDisplay answer={ANSWER.no}/></th>
              <th><AnswerDisplay answer={ANSWER.neutral}/></th>
              <th>Wichtig</th>
            </tr>
          </thead>
          <tbody>
            {ast.questions.map(q => <QuestionLine key={q.id} question={q} stats={s.stats} />) }
          </tbody>
        </table>
      </div>
    );
  }

}
