import React, { Component } from 'react';
import Color from './Color';

const colors = [
  '#0000ff', '#009fff', '#0fffff', '#bfffff', '#000000', '#333333', '#666666',
  '#999999', '#ffcc66', '#ffcc00', '#ffff00', '#ffff99', '#003300', '#555000',
  '#00ff00', '#99ff99', '#f00000', '#ff6600', '#ff9933', '#f5deb3', '#330000',
  '#663300', '#cc6600', '#deb887', '#aa0fff', '#cc66cc', '#ff66ff', '#ff99ff',
  '#e8c4e8', '#ffffff',
]

export default class ColorList extends Component {
  render() {
    return (
      <div class="colors">
          {Object.keys(colors).map((i, index) => {
            return (
              <Color
                color={colors[i]}
                handleColorChange={this.props.handleColorChange.bind(this, colors[i])}
              />
            )
          })}
      </div>
    );
  }
}