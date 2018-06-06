import React, { Component } from 'react';

export default class Brush extends Component {
  render() {
    const brush = this.props.brush;
    const handleBrushChange = this.props.handleBrushChange;
    return (
        <button 
            type="button" 
            value={brush} 
            onClick={handleBrushChange}></button>
    );
  }
}