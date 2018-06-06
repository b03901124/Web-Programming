var Immutable = require('immutable');
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http)

const port = 3000;

var initialState = {
  colors: [],
  brushs: [],
  lines: [],
  isDrawing: false
}

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// create a server object:
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

io.on('connection', function (socket) {
  socket.on('debug', function (data) {
    console.log(data)
  })  
  socket.on('onlineDrawDown', function (data) {
    // console.log(initialState)
    lines = initialState.lines.concat([[data.point]]);
    initialState.colors = initialState.colors.concat(data.color);
    initialState.brushs = initialState.brushs.concat(data.brush);
    initialState.isDrawing = data.isDrawing;
    initialState.lines = lines;
    socket.broadcast.emit('onlineDrawDown', data)
  })
  socket.on('onlineDrawMove', function (data) {
    lines = initialState.lines;
    l = lines[lines.length-1].concat([data.point]);
    lines[lines.length-1] = l;
    initialState.lines = lines;
    socket.broadcast.emit('onlineDrawMove', data)
  })
  socket.on('onlineDrawUp', function (data) {
    initialState.isDrawing = data.isDrawing
    socket.broadcast.emit('onlineDrawUp', data)
  })
  // socket.on('user:init', function (data) {
  //   socket.broadcast.emit('user:init', initialState)
  // })
})

http.listen(port, function(err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('listen on port ' + port);
});

