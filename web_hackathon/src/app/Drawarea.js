import React from 'react'
import Immutable from 'immutable'
var socket = io.connect()

export default class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      colors: [],
      brushs: [],
      lines: new Immutable.List(),
      isDrawing: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this._publicDrawingDown = this._publicDrawingDown.bind(this)
    this._publicDrawingMove = this._publicDrawingMove.bind(this)
    this._publicDrawingUp = this._publicDrawingUp.bind(this)
    this._initialize = this._initialize.bind(this)
    this._userInit = this._userInit.bind(this)
  }

  componentDidMount() {
    this._initialize()
    document.addEventListener("mouseup", this.handleMouseUp);
    socket.on('user:init', this._userInit);
    socket.on('onlineDrawDown', this._publicDrawingDown);
    socket.on('onlineDrawMove', this._publicDrawingMove);
    socket.on('onlineDrawUp', this._publicDrawingUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    var point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      colors: prevState.colors.concat(this.props.color),
      brushs: prevState.brushs.concat(this.props.brush),
      isDrawing: true
    }));
    socket.emit('onlineDrawDown',
                {point: point,
                color: this.props.color,
                brush: this.props.brush,
                isDrawing: true})
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }));
    socket.emit('onlineDrawMove',
                {point: point})
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
    socket.emit('onlineDrawUp',
                {isDrawing: false})
  }

	_initialize() {
    socket.emit('debug', 'new window!')
    socket.emit('user:init', socket.id)
  }	
  
  _userInit(data) {
    // socket.emit('debug', data)
    var colors = data.colors;
    var brushs = data.brushs;
    var lines = data.lines;
    var isDrawing = data.isDrawing;
    var i, j;
    var lines_ = new Immutable.List();
    for (i = 0; i < lines.length; i++) {
      const point_0 = new Immutable.Map({
        x: lines[i][0]["x"],
        y: lines[i][0]["y"],
      });
      lines_ = lines_.push(new Immutable.List([point_0]))
      for (j = 1; j < lines[i].length; j++) {
        const point = new Immutable.Map({
          x: lines[i][j]["x"],
          y: lines[i][j]["y"],
        });
        lines_ = lines_.updateIn([lines_.size - 1], line => line.push(point))
      }
    }

    socket.emit('debug', lines_)
    this.setState({
      lines: lines_,
      colors: colors,
      brushs: brushs,
      isDrawing: isDrawing,
    });
  }

  _publicDrawingDown(data) {
    const point = new Immutable.Map({
      x: data.point["x"],
      y: data.point["y"],
    });
    console.log(point)
    this.setState(prevState => ({
        lines: prevState.lines.push(new Immutable.List([point])),
        colors: prevState.colors.concat(data.color),
        brushs: prevState.brushs.concat(data.brush),
        isDrawing: true
      }));
  }

  _publicDrawingMove(data) {
    const point = new Immutable.Map({
      x: data.point["x"],
      y: data.point["y"],
    });
    console.log(point)
    this.setState(prevState => ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    })); 
  }

  _publicDrawingUp(data) {
    this.setState(prevState => ({
        isDrawing: data.isDrawing
    })); 
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  render() {
    return (
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      >
        <Drawing lines={this.state.lines} colors={this.state.colors} brushs={this.state.brushs}/>
      </div>
    );
  }
}

function Drawing({ lines, colors, brushs }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} color={colors[index]} brush={brushs[index]}/>
      ))}
    </svg>
  );
}

function DrawingLine({ line, color, brush }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

  return <path className="path" d={pathData} style={{stroke : color, strokeWidth: brush}} />;
}

// ReactDOM.render(<DrawArea />, document.getElementById("container"));