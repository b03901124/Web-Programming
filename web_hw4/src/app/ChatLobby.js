import React, { Component } from 'react'
import MessageList from './MessageList'
import Messager from './Messager'
import UserInput from './UserInput'
import Navbar from './Navbar'
var socket = io.connect()

const initialState = {
  newMessage: '',
  threads: {
    'Public Room': {
        name: 'Public Room',
        _id: 'Public Room',
        profilePic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
        messages: [
          { fromMe: false,
            userName: 'Manager - Allen',
            userID: 'Manager - Allen',
            userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
            text: 'Hello.',
            time: '00:00:00' },
          { fromMe: false,
            userName: 'Manager - Allen',
            userID: 'Manager - Allen',
            userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
            text: 'Welcome to Web!!',
            time: '00:00:00' }
        ]
    },
  },
  userID: null,
  userName: null,
  userPic: null,
  currentTargetID: 'Public Room',
  currentTargetName: 'Public Room',
  onlineUsers: {},
  onlineUserNum: 0
}

export default class ChatLobby extends Component {
  constructor (props) {
    super(props)
    this.state = initialState
    this.state.userName = this.props.username
    this.state.userPic = this.props.userpic
		this._publicMessageRecieve = this._publicMessageRecieve.bind(this)
		this._googleMessageRecieve = this._googleMessageRecieve.bind(this)
		this._privateMessageRecieve = this._privateMessageRecieve.bind(this)
		this._userJoined = this._userJoined.bind(this)
    this._userInit = this._userInit.bind(this)
    this._initialize = this._initialize.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  handleUserNumChange () {
    const onlineUserNum = this.state.onlineUserNum
  }

  handleMessageChange (event) {
    this.setState({ newMessage: event.target.value })
  }

  handleMessagerChange (event) {
    socket.emit('debug', event)
    this.setState({ currentTargetID: event })
  }

  handleMessagerAdd (event) {
    socket.emit('debug', event)
    if (!(event.userID in this.state.threads)) {
      const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
      threads[event.userID] = {name: event.userName,
                        profilePic: event.userPic,
                        messages: [
                        { fromMe: false,
                          userName: 'Manager - Jack',
                          userID: 'Manager - Jack',
                          userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
                          text: 'This is the very beginning of your conversation with ' + event.userName,
                          time: new Date().toTimeString().slice(0, 8)}]}
      this.setState({threads: threads})
    }

    this.setState({ currentTargetID: event.userID })
  }

  handleKeyDown (event) {
    const message = event.target.value
    const time = new Date().toTimeString().slice(0, 8)
    const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
    const addMessage = {fromMe: true,
                        userPic: userPic,
                        userName: userName,
                        userID : userID,
                        text: message, time: time}

    if (event.keyCode === 13 && message !== '') {
      threads[currentTargetID].messages.push(addMessage)

      this.setState({
        newMessage: '',
        threads: threads
      })
      if (currentTargetID == 'Public Room') {
        socket.emit('onlineUsers', {userName: userName, userID : userID,
                                    userPic: userPic, message: addMessage})
      }
      else if (currentTargetID == 'Miss Google') {
        socket.emit('google',
                    {userName: userName, userID : userID,
                      userPic: userPic, message: addMessage})
      }
      else {
        socket.emit('private_message',
                    {userID: userID,
                     userName: userName,
                     userPic: userPic,
                     message: addMessage,
                     targetID: currentTargetID,
                     targetName: currentTargetName})
      }
   }
  }

  componentDidUpdate(prevProp, prevState) {
    const {newMessage, threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
    if (this.state.newMessage == '') {
      this.scrollToBottom()
    }
  }

  componentDidMount () {
    this._initialize()
    socket.on('onlineUsers', this._publicMessageRecieve)
    socket.on('google', this._googleMessageRecieve)
    socket.on('private_message', this._privateMessageRecieve)
    socket.on('user:init', this._userInit);
    socket.on('user:join', this._userJoined);
    socket.on('user:left', this._userLeft);
    socket.on('change:name', this._userChangedName);
	}

	_initialize() {
      this.setState({userID: socket.id})
      socket.emit('user:init', {userName: this.state.userName, userPic: this.state.userPic})
	}

	_publicMessageRecieve(data) {
    if (data.message !== undefined) {
      const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
      const time = new Date().toTimeString().slice(0, 8)
      const addMessage = {fromMe: false,
                          userID: data.message.userID,
                          userName: data.message.userName,
                          userPic: data.message.userPic,
                          text: data.message.text,
                          time: data.message.time}
      threads['Public Room'].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}
	_googleMessageRecieve(data) {
    if (data.message !== undefined) {
      const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userID: data.message.userID,
                          userName: data.message.userName,
                          userPic: data.message.userPic,
                          text: data.message.text,
                          time: data.message.time}
      threads['Miss Google'].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}

	_privateMessageRecieve(data) {
    console.log(data)
    if (data.message !== undefined) {
      const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
      if (!(data.userID in threads)) {
        this.handleMessagerAdd(data)
      }
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userID: data.message.userID,
                          userName: data.message.userName,
                          userPic: data.message.userPic,
                          text: data.message.text,
                          time: data.message.time}
      threads[data.userID].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}
	_userInit(data) {
    const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
    threads['Public Room'].messages = data
    this.setState({threads: threads})
  }
	_userJoined(data) {
    if (this.state.userID == null) {
      this.setState({userID: data.userID})
    }
    const {threads, userID, userName, userPic, currentTargetID, currentTargetName, onlineUsers, onlineUserNum} = this.state
    onlineUsers[data.userID] = data.userName
    this.setState({onlineUsers: onlineUsers,
                   onlineUserNum: data.onlineUserNum})
	}

	_userLeft(data) {
    delete initialState.users[socket.id]
	}

	_userChangedName(data) {
	}

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'auto' });
  }
  render () {
    const {threads, userID, userName, userPic, currentTargetID, currentTargetName,
           onlineUsers, onlineUserNum} = this.state
    return (
      <div className='chat-app clarfix'>
        <Navbar
          onlineUserNum={onlineUserNum}
          handleUserNumChange={this.handleUserNumChange.bind(this)}
          userID={userID}
          userName={userName}
          userPic={userPic}
        />

        <div className='chat-app_left'>
          <div className='heading'>
            <h3 className='messenger-title'>Messagers</h3>
          </div>
          <div className='thread-list'>
            {Object.keys(threads).map((id_, index) => {
              const thread = threads[id_]
              const { name, profilePic, messages } = thread
              const lastMessage = messages[messages.length - 1]
              return (
                <Messager
                  key={id_}
                  src={profilePic}
                  name={name}
                  content={lastMessage.text}
                  time={lastMessage.time}
                  handleMessagerChange={this.handleMessagerChange.bind(this, id_)}
                />
              )
            })}
          </div>
        </div>
        <div className='chat-app_right'>
          <div className='heading'>
            <div className='current-target'>{threads[currentTargetID].name}</div>
          </div>
          <div className='message-list'>
            <MessageList
              threads={threads}
              id_={currentTargetID}
              name_={currentTargetName}
              handleMessagerAdd={this.handleMessagerAdd.bind(this)}/>
            <div ref={el => { this.el = el; }} />
          </div>
          <div className='footer'>
            <UserInput newMessage={this.state.newMessage}
              messageChange={this.handleMessageChange.bind(this)}
              handleKeyDown={this.handleKeyDown.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}