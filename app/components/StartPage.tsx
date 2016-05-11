/// <reference path="../../typings/main.d.ts" />
import * as React from 'react';
import { Link } from 'react-router';

export class StartPage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h2>StartPage</h2>
        <Link to={`/questions/`}>Start</Link>
      </div>
    );
  }
}
