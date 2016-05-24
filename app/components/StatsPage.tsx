/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';


import * as AppState from '../app-state';
import {loadStats} from '../web-service';
import {Question, Weight, Stats, ANSWER} from '../app-state-interfaces';
import {getQuestionStats} from '../model';
import { AnswerDisplay } from './AnswerDisplay';


interface RowValues {
  question: Question;
  meanAgreement: number;
  yes: number;
  no: number;
  neutral: number;
  important: number;
}

interface StatsPageState {
  stats: Stats;
}

const TableRow = (props: { rowValues: RowValues }) => {
  const {question, meanAgreement, yes, no, neutral, important} = props.rowValues;
  return (
    <tr>
      <td>{question.text}</td>
      <td>
        <div className='valueBar' title={'' + meanAgreement}>
          <div className='valueBarValue' style={{ width: meanAgreement * 100 + '%' }}></div>
          <div className='valueBarLabel'>{Math.round(meanAgreement * 100) } %</div>
        </div>
      </td>
      <td>{yes}</td>
      <td>{no}</td>
      <td>{neutral}</td>
      <td>{important}</td>
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

    const rows = ast.questions.map((question): RowValues => {
      const questionStats = getQuestionStats(s.stats, question.id);
      const answerStats = questionStats.answerStats;
      const [yes, no, neutral] = [ANSWER.yes, ANSWER.no, ANSWER.neutral].map(a => answerStats[a] || 0);
      const meanAgreement = (yes + no > 0) ? yes / (yes + no) : 0.5;
      return {
        question, meanAgreement, yes, no, neutral,
        important: questionStats.weightStats[Weight.IMPORTANT]
      };
    });

    const sortedRows = R.reverse(R.sortBy(row => row.meanAgreement, rows));

    return (
      <div>
        <h2>Statistik</h2>
        <p>Wie haben andere "gewählt"?</p>
        <table>
          <thead>
            <tr>
              <th>Frage</th>
              <th>Gesamtposition</th>
              <th><AnswerDisplay answer={ANSWER.yes}/></th>
              <th><AnswerDisplay answer={ANSWER.no}/></th>
              <th><AnswerDisplay answer={ANSWER.neutral}/></th>
              <th>Wichtig</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(row => <TableRow key={row.question.id} rowValues={row} />) }
          </tbody>
        </table>
      </div>
    );
  }

}
