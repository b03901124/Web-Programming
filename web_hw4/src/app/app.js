// import React from 'react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ChatLobby from "./ChatLobby";
require('./App.css');
require('./Login.css');
import './index.css';
import './normalize.css';
import './reset.css';
import './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', userpic: '', submitted: false};

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.userpicChangeHandler = this.userpicChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
  }

  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  userpicChangeHandler(event) {
    this.setState({ userpic: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ submitted: true, 
                    username: this.state.username,
                    userpic: this.state.userpic});
  }

  render() {
    if (this.state.submitted){
      return (
        <ChatLobby username={this.state.username} userpic={this.state.userpic} imageUrl={'.com'}/>
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
          <input 
            type="text"
            onChange={this.userpicChangeHandler}
            placeholder="Enter a picture url..."
            required autoFocus/>
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

App.defaultProps = {};

export default App;
ReactDOM.render(<App />, document.getElementById('app'));