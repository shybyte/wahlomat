/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

interface IAppState {
  count: number;
}

export class App extends React.Component<{}, IAppState> {
  state = {
    count: 0,
  };

  onClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (<div>
      <div className='count'>{this.state.count}</div>
      <button onClick={this.onClick}>Add</button>
    </div>
    );
  }
}
