/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';


import * as AppState from '../app-state';
import {loadStats} from '../web-service';
import {Question, QuestionsStatsMap, Weight, Stats, ANSWER} from '../app-state-interfaces';
import {getQuestionStats} from '../model';
import { AnswerDisplay } from './AnswerDisplay';


interface RowValues {
  question: Question;
  meanAgreement: number;
  yes: number;
  no: number;
  neutral: number;
  important: number;
  interest: number;
  relativeInterest: number;
}

interface StatsPageState {
  stats?: Stats;
}

const TableRow = (props: { rowValues: RowValues }) => {
  const {question, interest, relativeInterest, meanAgreement, yes, no, neutral} = props.rowValues;
  const agreementTooltip =
    `( ${yes} × Ja + 0.5 × ${neutral} × Neutral) / (${yes} × Ja + ${neutral} × Neutral + ${no} × Nein) = ` + meanAgreement.toFixed(2);
  return (
    <tr>
      <td title={'Frage ' + question.id}>{question.text}</td>
      <td>
        <div className='valueBar' title={'Summe der Ja/Nein Antworten wobei als wichtig markierte Antworten doppelt zählen = ' + interest}>
          <div className='valueBarValue' style={{ width: relativeInterest * 100 + '%' }}></div>
        </div></td>
      <td>
        <div className='valueBar' title={agreementTooltip}>
          <div className='valueBarValue' style={{ width: meanAgreement * 100 + '%' }}></div>
          <div className='valueBarLabel'>{Math.round(meanAgreement * 100) } %</div>
        </div>
      </td>
      <td>{yes}</td>
      <td>{no}</td>
      <td>{neutral}</td>
    </tr>
  );
};

function sortKey(row: RowValues) {
  return [(row.interest / 1e10).toFixed(10), row.meanAgreement.toFixed(3)].join('-');
}

export class StatsPage extends React.Component<{}, StatsPageState> {
  state: StatsPageState = {};

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
    const stats = s.stats;


    const questionsStats: QuestionsStatsMap = s.stats.questionsStats;
    const interests = R.values(questionsStats).map(qs => qs.interest);
    // const minInterest = interests.reduce(R.min, Number.MAX_VALUE);
    const maxInterest = interests.reduce(R.max, Number.MIN_VALUE);

    const rows = ast.questions.map((question): RowValues => {
      const questionStats = getQuestionStats(stats, question.id);
      const answerStats = questionStats.answerStats;
      const [yes, no, neutral] = [ANSWER.yes, ANSWER.no, ANSWER.neutral].map(a => answerStats[a] || 0);
      const allAnswerCount = yes + no + neutral;
      const meanAgreement = (allAnswerCount > 0) ? (yes + 0.5 * neutral) / (allAnswerCount) : 0.5;
      const important = questionStats.weightStats[Weight.IMPORTANT];
      const {interest} = questionStats;
      const relativeInterest = interest / maxInterest;
      return { question, meanAgreement, yes, no, neutral, important, interest, relativeInterest };
    });

    const sortedRows = R.reverse(R.sortBy(sortKey, rows));

    return (
      <div>
        <h2>Kiezbarometer</h2>
        <p>Wie haben andere "gewählt"?</p>
        <table>
          <thead>
            <tr>
              <th>Frage</th>
              <th title='Summe der Ja/Nein Antworten wobei als wichtig markierte Antworten doppelt zählen'>Interesse</th>
              <th title='(Ja + 0.5 × Neutral) / (Ja + Neutral + Nein)'>Zustimmung</th>
              <th><AnswerDisplay answer={ANSWER.yes}/></th>
              <th><AnswerDisplay answer={ANSWER.no}/></th>
              <th><AnswerDisplay answer={ANSWER.neutral}/></th>
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
