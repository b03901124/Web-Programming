import React, { Component } from 'react';
import Brush from './Brush';

const brushes = ['1', '2', '3', '4', '5']

export default class BrushList extends Component {
  render() {
    return (
      <div class="brushes">
          {Object.keys(brushes).map((i, index) => {
            return (
              <Brush
                brush={brushes[i]}
                handleBrushChange={this.props.handleBrushChange.bind(this, brushes[i])}
              />
            )
          })}
      </div>
    );
  }
}