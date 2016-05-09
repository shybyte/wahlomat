/// <reference path="../typings/main.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/app';
import { loadCss } from './styles/styles';
import { loadData , DataBase} from './database';

loadCss();


class Main extends React.Component<DataBase, {}> {
  public render() {
    return <App questions={this.props.questions} />;
  }
}

loadData().then(data => {
  ReactDOM.render(<Main questions={data.questions} />, document.getElementById('app'));
});
