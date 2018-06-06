import React from 'react';
import ReactDOM from 'react-dom';
import DrawArea from './Drawarea';
import ColorList from './ColorList';
import BrushList from './BrushList';
import ButtonList from './ButtonList';
import './style.css';
import './Drawarea.css'

class App extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            color: 'black',
            brush: '1px'
        };
    }

    handleColorChange (event) {
        this.setState({ color: event });
    }

    handleBrushChange (event) {
        this.setState({ brush: event });
    }

    render(){
        return(
            <div>
                <main>
                    <div class="left-block">
                        <ColorList handleColorChange={this.handleColorChange.bind(this)}/>
                        <BrushList handleBrushChange={this.handleBrushChange.bind(this)} />
                        <ButtonList />
                    </div>
                    <div class="right-block">
                        <DrawArea color={this.state.color} brush={this.state.brush}/>
                    </div>
                </main>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('app'));