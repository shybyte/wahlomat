/// <reference path="../../typings/main/index.d.ts" />

import * as R from 'ramda';
import * as React from 'react';
import { Link } from 'react-router';
import * as classNames from 'classnames';



import * as AppState from '../app-state';
import {getCurrentVote, saveVote } from '../app-state';
import {Question, Weight} from '../app-state-interfaces';
import {ROUTES} from '../routes';
import { AnswerDisplay } from './AnswerDisplay';


interface WeightingState {
}

const QuestionLine = (props: { question: Question }) => {
  const questionId = props.question.id;
  const weight = AppState.getState().weights[questionId];
  const importantIconClass = classNames('importantIcon', {
    visible: weight === Weight.IMPORTANT
  });

  function onChange(ev: Event) {
    const inputEl = ev.target as HTMLInputElement;
    AppState.setWeight(questionId, inputEl.checked ? Weight.IMPORTANT : Weight.NORMAL);
  }

  return (
    <tr>
      <td title={'Frage ' + questionId}>{props.question.text}</td>
      <td><AnswerDisplay answer={AppState.getState().answers[props.question.id]} /></td>
      <td>
        <input type='checkbox'
          checked={weight === Weight.IMPORTANT}
          onChange={onChange}/>
        <span className={importantIconClass}>&#215; 2</span>
      </td>
    </tr>
  );
};

export class Weighting extends React.Component<{}, WeightingState> {
  state = {
  };

  render() {
    const ast = AppState.getState();
    return (
      <div>
        <h2>Welche Fragen sind Ihnen wichtig?</h2>
        <p>Der Wahlomat wertet markierte Fragen bei der Auswertung doppelt.</p>
        {this.renderNextSteps() }
        <table>
          <thead>
            <tr>
              <th>Frage</th>
              <th>Ihre Position</th>
              <th>Wichtig</th>
            </tr>
          </thead>
          <tbody>
            {ast.questions.map(q => <QuestionLine key={q.id} question={q} />) }
          </tbody>
        </table>
        <div className='nextStepsBottom'>
          {this.renderNextSteps() }
        </div>
      </div>
    );
  }

  renderNextSteps() {
    const {savedVote} = AppState.getState();
    const omitSession = R.omit(['sessionId']);
    return (
      <div>
        <p className={classNames('saveVoteSection', {
          saved: R.equals(omitSession(savedVote), omitSession(getCurrentVote())) ? true : false
        }) }>
          <button onClick={saveVote}>Speicher</button> meine Anworten für das Kiezbarometer.
        </p>
        <Link to={ROUTES.results} activeClassName='active'>Weiter zum Ergebnis</Link>
      </div>
    );
  }

}
