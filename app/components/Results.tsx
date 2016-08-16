/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';
import { Link } from 'react-router';
import {ROUTES} from '../routes';
import {WahlkreiseMap} from './WahlkreiseMap';


import { Candidate, Region } from '../app-state-interfaces';
import { getState, getSortedRegions} from '../app-state';
import { getSimilarities } from '../model';

export class Results extends React.Component<{}, {}> {
  render() {
    const regions = getSortedRegions();
    return (
      <div>
        <h1>Ergebnis</h1>
        <div>
          {regions.map(region => <RegionalResult key={region.id} region= {region} />) }
        </div>
        <Link to={ROUTES.stats} activeClassName='active'>Was haben andere Wahlomat-Benutzer geantwortet? Ab zum Kiezbarometer!</Link>
        <WahlkreiseMap/>
      </div>
    );
  }
}

export class RegionalResult extends React.Component<{ region: Region }, {}> {
  render() {
    const {answers, weights, candidates} = getState();
    const regionCanidates = candidates.filter(candidate => R.contains(this.props.region.id, candidate.regions));
    const similarities = getSimilarities(answers, weights, regionCanidates);
    const sortedParties = R.reverse(R.sortBy(q => (similarities[q.id] as any as string), regionCanidates));

    function renderCandidate(candidate: Candidate) {
      return (
        <tr key={candidate.id}>
          <td>{candidate.name} <br/>({candidate.party}) </td>
          <td className='percent'>{Math.round(similarities[candidate.id] * 100) } %</td>
        </tr>
      );
    }

    return (
      <div className='resultByRegion'>
        <h2>{this.props.region.name}</h2>
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
