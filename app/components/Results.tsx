/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';
import { Link } from 'react-router';
import {ROUTES} from '../routes';


import { Candidate } from '../app-state-interfaces';
import { getState} from '../app-state';
import { getSimilarities } from '../model';

export class Results extends React.Component<{}, {}> {
  render() {
    const {candidates} = getState();
    const regions = R.uniq(candidates.map(c => c.region)).sort();
    return (
      <div>
        <h1>Ergebnis</h1>
        <div>
        {regions.map(region => <RegionalResult key={region} region={region} />)}
        </div>
        <Link to={ROUTES.stats} activeClassName='active'>Was haben andere Wahlomat-Benutzer geantwortet? Ab zum Kiezbarometer!</Link>
      </div>
    );
  }
}

export class RegionalResult extends React.Component<{region: string}, {}> {
  render() {
    const {answers, weights, candidates, regions} = getState();
    const regionCanidates = candidates.filter(candidate => candidate.region === this.props.region);
    const similarities = getSimilarities(answers, weights, regionCanidates);
    const sortedParties = R.reverse(R.sortBy(q => (similarities[q.id] as any as string), regionCanidates));

    function renderCandidate(candidate: Candidate) {
      return (
        <tr key={candidate.id}>
          <td>{candidate.name} <br/>({candidate.party})</td>
          <td className='percent'>{Math.round(similarities[candidate.id] * 100) } %</td>
        </tr>
      );
    }

    return (
      <div className='resultByRegion'>
        <h2>{regions[this.props.region].name}</h2>
        <table>
          <thead>
            <tr>
              <th>Kandidat</th>
              <th>Übereinstimmung</th>
            </tr>
          </thead>
          <tbody>
            {sortedParties.map(renderCandidate) }
          </tbody>
        </table>
      </div>
    );
  }
}
