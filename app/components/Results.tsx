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
        <div key={party.id}>
          <h3>{party.name}</h3>
          <span>{Math.round(similarities[party.id] * 100) } %</span>
        </div>
      );
    }

    return (
      <div>
        <h1>Ergebnis</h1>
        {sortedParties.map(renderParty) }
      </div>
    );
  }
}
