/// <reference path="../../typings/main/index.d.ts" />
import * as React from 'react';
import { Link } from 'react-router';

export class StartPage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h2>StartPage</h2>
        <p>Hier steht ein sehr interessanter einführender Text.</p>
        <Link to={`/questions/`}>Los geht's! Ab zu den Fragen!</Link>
      </div>
    );
  }
}
