/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/app';
import { loadCss } from './styles/styles';

loadCss();

class Main extends React.Component<{}, {}> {
  public render() {
    return <App />;
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
