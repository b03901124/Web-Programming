import React, { Component } from 'react';

export default class Color extends Component {
  render() {
    const color = this.props.color;
    const handleColorChange = this.props.handleColorChange;
    return (
        <button 
            type="button" 
            value={color} 
            onClick={handleColorChange}></button>
    );
  }
}