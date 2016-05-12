/// <reference path="../typings/main.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


import { QuestionsWizard } from './components/QuestionsWizard';
import { Results } from './components/Results';
import { StartPage } from './components/StartPage';
import { NotFound } from './components/NotFound';
import { loadCss } from './styles/styles';
import * as AppState from './app-state';

loadCss();

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

AppState.subscribe(appState => {
  console.log('Render', appState);
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path='/' component={Layout}>
        <IndexRoute component={StartPage} />
        <Route path='questions' component={QuestionsWizard}/>
        <Route path='results' component={Results}/>
        <Route path='*' component={NotFound}/>
      </Route>
    </Router>
  ), document.getElementById('app'));
});

AppState.init();
