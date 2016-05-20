/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as R from 'ramda';

import { Party, getState } from '../app-state';
import { getSimilarities } from '../results';

export class Results extends React.Component<{}, {}> {
  render() {
    const {answers, weights, parties} = getState();
    const similarities = getSimilarities(answers, weights, parties);
    const sortedParties = R.reverse(R.sortBy(q => similarities[q.id], parties));
    function renderParty(party: Party) {
      return (
        <tr key={party.id}>
          <td>{party.name}</td>
          <td className='percent'>{Math.round(similarities[party.id] * 100) } %</td>
        </tr>
      );
    }

    return (
      <div>
        <h1>Ergebnis</h1>
        <table>
          <thead>
            <tr>
              <th>Partei</th>
              <th>Übereinstimmung</th>
            </tr>
          </thead>
          <tbody>
            {sortedParties.map(renderParty) }
          </tbody>
        </table>
      </div>
    );
  }
}
