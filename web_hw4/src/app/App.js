import React, { Component } from 'react';
import ChatLobby from "./ChatLobby";
require('./App.css');
require('./Login.css');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', submitted: false};

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
  }

  usernameChangeHandler(event) {
    this.setState({ usernam: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ submitted: true, username: this.state.username});
  }

  render() {
    if (this.state.submitted){
      return (
        <ChatLobby username={this.state.username} imageUrl={'.com'}/>
      )
    }
    return (
      <form onSubmit={this.usernameSubmitHandler} className="username-container">
        <h1> My Chatroom </h1>
        <div>
          <input 
            type="text"
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required autoFocus/>
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

App.defaultProps = {};

export default App;