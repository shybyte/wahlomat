/// <reference path="../typings/main.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


import { App } from './components/app';
import { Results } from './components/Results';
import { StartPage } from './components/StartPage';
import { NotFound } from './components/NotFound';
import { loadCss } from './styles/styles';
import { loadData, DataBase} from './database';

loadCss();

class QuestionsLoader extends React.Component<{}, { dataBase?: DataBase }> {
  state = {
    dataBase: null as DataBase
  };

  componentDidMount() {
    loadData().then(dataBase => {
      this.setState({ dataBase });
    });
  }

  public render() {
    if (!this.state.dataBase) {
      return <div>Loading</div>;
    }
    return <App questions={this.state.dataBase.questions} />;
  }
}


class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <h1>Wahlomat</h1>
        {this.props.children}
      </div>
    );
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={StartPage} />
      <Route path='questions' component={QuestionsLoader}/>
      <Route path='results' component={Results}/>
      <Route path='*' component={NotFound}/>
    </Route>
  </Router>
), document.getElementById('app'));
