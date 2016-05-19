/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';

import * as AppState from '../app-state';


interface WeightingState {
}

const QuestionLine = (props: { question: AppState.Question }) => {
  const questionId = props.question.id;
  const weight = AppState.getState().weights[questionId];

  function onChange(ev: Event) {
    const inputEl = ev.target as HTMLInputElement;
    AppState.setWeight(questionId, inputEl.checked ? AppState.Weight.IMPORTANT : AppState.Weight.NORMAL);
  }

  return (
    <tr>
      <td>{props.question.text}</td>
      <td>{AppState.getState().answers[props.question.id]}</td>
      <td>
        <input type='checkbox'
          checked={weight === AppState.Weight.IMPORTANT}
          onChange={onChange}/>
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
        <table>
          <thead>
            <tr>
              <th>Frage</th>
              <th>Ihre Antwort</th>
              <th>Wichtig</th>
            </tr>
          </thead>
          <tbody>
            {ast.questions.map(q => <QuestionLine key={q.id} question={q} />) }
          </tbody>
        </table>
      </div>
    );
  }

}
