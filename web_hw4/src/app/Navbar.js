import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Navbar extends Component {
  // static propTypes = {
  //   onlineUserNum: PropTypes.number.isRequired,
  //   handleUserNumChange: PropTypes.func.isRequired,
  //   userID: PropTypes.string,
  //   userName: PropTypes.string,
  //   userPic: PropTypes.string,
  // }

  componentWillUnmount () {
  }

  render () {
    const {onlineUserNum, handleUserNumChange, userID, userName, userPic} = this.props;
    console.log(userPic)
    return (
      <nav className='nav-bar'>
        <div className='nav-padding'>
          <div className='nav-title'>
            <span> NTUEE Web </span>
          </div>
        </div>
        <div className='nav-pic'>
          <img className="message-profile" src={userPic} />
        </div>
        <div className='nav-user'>
          Name: {!userName ? userID : userName}
        </div>
        <div className='nav-usernum' onClick={handleUserNumChange}>
          <span > Online users: {onlineUserNum} </span>
          <div id='num'> </div>
        </div>
      </nav>
    )
  }
}
