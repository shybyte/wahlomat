/// <reference path="../typings/main/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
require('babel-polyfill');


import { QuestionsWizard } from './components/QuestionsWizard';
import { Results } from './components/Results';
import { Weighting } from './components/Weighting';
import { StartPage } from './components/StartPage';
import { NotFound } from './components/NotFound';
import { ReasonsWizard } from './components/ReasonsWizard';
import { StatsPage } from './components/StatsPage';
import { loadCss } from './styles/styles';
import * as AppState from './app-state';
import {ROUTES} from './routes';

loadCss();

class Layout extends React.Component<{}, {}> {
  public render() {
    const appState = AppState.getState();
    return (
      <div className='wahlomat'>
        <h1>Wahlomat</h1>
        <div className='menu'>
          <Link to={ROUTES.questions} activeClassName='active'>Fragen</Link>
          {appState.questionsDone ?
            <span className='menuSection'>
              <Link to={ROUTES.weighting} activeClassName='active'>Gewichtung</Link>
              <Link to={ROUTES.results} activeClassName='active'>Ergebnis</Link>
            </span>
            : null
          }
          <Link to={ROUTES.stats} activeClassName='active'>Kiezbarometer</Link>
        </div>
        {this.props.children}
        <img className='kiezbarometerLogo' src='img/kiezbarometer-logo.png' alt=''/>
      </div>
    );
  }
}

const routes = <Route path='/' component={Layout}>
  <IndexRoute component={StartPage} />
  <Route path={ROUTES.questions} component={QuestionsWizard}/>
  <Route path={ROUTES.weighting} component={Weighting}/>
  <Route path={ROUTES.results} component={Results}/>
  <Route path={ROUTES.reasons} component={ReasonsWizard}/>
  <Route path={ROUTES.stats} component={StatsPage}/>
  <Route path='*' component={NotFound}/>
</Route>;

AppState.subscribe(appState => {
  console.log('Render', appState);
  ReactDOM.render((
    <Router history={hashHistory} routes={routes}/>
  ), document.getElementById('app'));
});

AppState.init();
