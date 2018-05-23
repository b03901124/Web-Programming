import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageItem from './MessageItem';

export default class MessageList extends Component {
  // static propTypes = {
  //   threads: PropTypes.object.isRequired,
  //   id_: PropTypes.string.isRequired,
  //   handleMessagerAdd: PropTypes.func.isRequired
  // }

  render() {
    const { threads, id_, name_, handleMessagerAdd} = this.props;
    const messages = threads[id_].messages;
    const target = threads[id_];
    return (
      <div>
        {messages.map((message, id) => {
          return (
            <MessageItem key={id}
                         userID={message.userID}
                         userName={message.userName}
                         userPic={message.userPic}
                         fromMe={message.fromMe}
                         text={message.text}
                         time={message.time}
                         icon={message.userPic}
                        //  icon={target.profilePic}
                         handleMessagerAdd={handleMessagerAdd}/>

          );
        })}
      </div>
    );
  }
}
