/// <reference path="../../typings/main.d.ts" />

import * as React from 'react';

import * as AppState from '../app-state';

interface WeightingState {
}

const QuestionLine = (props: { question: AppState.Question }) => (
  <tr>
    <td>{props.question.title}</td>
    <td>{AppState.getState().answers[props.question.id]}</td>
  </tr>
);

export class Weighting extends React.Component<{}, WeightingState> {
  state = {
  };

  render() {
    const ast = AppState.getState();
    return (
      <div>
        <h2>Gewichtung</h2>
        <table>
          <tbody>
            {ast.questions.map(q => <QuestionLine question={q} />) }
          </tbody>
        </table>
      </div>
    );
  }

}
