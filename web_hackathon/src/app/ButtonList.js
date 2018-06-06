import React, { Component } from 'react';

export default class ColorList extends Component {
  render() {
    return (
      <div class="buttons">
        <button id="clear" type="button">Clear</button>
        <button id="save" type="button">Save</button>
      </div>
    );
  }
}