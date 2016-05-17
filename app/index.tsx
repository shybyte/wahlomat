/// <reference path="../typings/main.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';


import { QuestionsWizard } from './components/QuestionsWizard';
import { Results } from './components/Results';
import { Weighting } from './components/Weighting';
import { StartPage } from './components/StartPage';
import { NotFound } from './components/NotFound';
import { loadCss } from './styles/styles';
import * as AppState from './app-state';
import {ROUTES} from './routes';

loadCss();

class Layout extends React.Component<{}, {}> {
  public render() {
    const appState = AppState.getState();
    return (
      <div>
        <h1>Wahlomat</h1>
        <div className='menu'>
          <Link to={ROUTES.questions} activeClassName='active'>Fragen</Link>
          {appState.questionsDone ?
            <Link to={ROUTES.weighting} activeClassName='active'>Gewichtung</Link>
            : null}
        </div>
        {this.props.children}
      </div>
    );
  }
}

const routes = <Route path='/' component={Layout}>
  <IndexRoute component={StartPage} />
  <Route path={ROUTES.questions} component={QuestionsWizard}/>
  <Route path={ROUTES.weighting} component={Weighting}/>
  <Route path={ROUTES.results} component={Results}/>
  <Route path='*' component={NotFound}/>
</Route>;

AppState.subscribe(appState => {
  console.log('Render', appState);
  ReactDOM.render((
    <Router history={browserHistory} routes={routes}/>
  ), document.getElementById('app'));
});

AppState.init();
