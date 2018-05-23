var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http)

const port = 3000;

var initialState = {
  publicMessages: [
          { fromMe: false,
            userID: 'Manager - Jack',
            userName: 'Manager - Jack',
            userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
            text: 'Hello, I am Chatroom Manager (Jack).',
            time: '00:00:00' },
          { fromMe: false,
            userID: 'Manager - Jack',
            userName: 'Manager - Jack',
            userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
            text: 'Welcome to Web Programming HW4 Demo!! Test',
            time: '00:00:00' }
  ],
  users: {},
  onlineUserNum: 0
}

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// create a server object:
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

io.on('connection', function (socket) {

  socket.on('user:init', function (data) {
    initialState.users[socket.id] = data.userName
    initialState.onlineUserNum = Object.keys(initialState.users).length
    socket.emit('user:init', initialState.publicMessages)
    io.emit('user:join',
            {userID: socket.id,
             userName: data.userName,
             userPic: data.userPic,
             onlineUserNum: initialState.onlineUserNum})
    console.log(data.userName + ' connected')
    console.log(data)
    const message = {fromMe: false,
                     userID: socket.id,
                     userName: data.userName,
                     userPic: data.userPic,
                     text: data.userName + ' joined this room',
                     time: new Date().toTimeString().slice(0, 8)}
    io.emit('onlineUsers', {message: message})
    initialState.publicMessages.push(message)
    console.log(initialState)
  })
  // socket.on('google', function (data) {
  //   const languages = ['en', 'zh-tw', 'ja', 'ko', 'ru', 'es', 'fr']
  //   const min = 0
  //   const max = languages.length - 1
  //   const language = languages[Math.floor(Math.random() * languages.length)]
  //   console.log(language)
	// 	translate(data.message.text, {to: language}).then(res => {
  //     const translated_message = {fromMe: false,
  //                                 userName: 'Miss Google',
  //                                 text: res.text,
  //                                 time: data.message.time}
  //     socket.emit('google', {message: translated_message})
  //   }).catch(err => {
  //     socket.emit('google', err)
  //   });
  // })
  socket.on('debug', function (data) {
    console.log(data)
  })
  socket.on('onlineUsers', function (data) {
    var msg = data.message
    msg.fromMe = false
    initialState.publicMessages.push(msg)
    socket.broadcast.emit('onlineUsers', data)
    console.log(data)
  })
  socket.on('private_message', function (data) {
    socket.broadcast.to(data.targetID).emit('private_message', data)
    // console.log(data.target)
    console.log(data)
  })

  socket.on('disconnect', function () {
    socket.emit('user:left', socket.id)
    if (socket.id in initialState.users) {
      console.log(initialState.users[socket.id])
      name = initialState.users[socket.id]
      delete initialState.users[socket.id]
      const message = {fromMe: false,
                       userName: 'Manager - Jack',
                       userPic: 'https://scontent.ftpe7-2.fna.fbcdn.net/v/t1.0-1/p50x50/14316760_1129003400500408_9045190863485455616_n.jpg?_nc_cat=0&_nc_eui2=AeHXfukUI_rC1QFolDFyuwLvjGXx-Urw1gPsKtWifLlB1IKQhexHbpLszPUdUg1Ebuzs0SjSgGdWIA3dDq1jOXZsWBwuDFxxD53MBie0IlMdPw&oh=5705352d9620c4fcd1e0191196150048&oe=5B849121',
                       text: name + ' left this room',
                       time: new Date().toTimeString().slice(0, 8)}
      io.emit('onlineUsers', {message: message})
      initialState.publicMessages.push(message)
      console.log(socket.id + ' disconnected')
    }
  })
})

http.listen(port, function(err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('listen on port ' + port);
});
