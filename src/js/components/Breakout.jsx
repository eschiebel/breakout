import React from 'react';
import GameStore from '../stores/GameStore';
import Court from './Court';
import Scoreboard from './Scoreboard';

const CLASS = 'Breakout';

class Breakout extends React.Component {
    constructor(props) {
        super(props);

        this.gameStoreUnlistener = GameStore.listen(this.onGameStateChange.bind(this));

        this.state = {
            gameState: GameStore.getState()
        }
    }

    componentWillUnmount() {
        this.gameStoreUnlistener();
    }
    shouldComponentUpdate(newProps, newState) {
        return newState.gameState !== this.state.gameState;
    }
    render() {
        //console.log(CLASS, 'render');
        return (
            <div className="the-game">
                <Scoreboard score={this.state.gameState.get('score')} balls={this.state.gameState.get('balls')}/>
                <Court gameState={this.state.gameState} />
            </div>
        );
    }

    onGameStateChange(newstate) {
        this.setState({gameState: newstate})
    }
}

export default Breakout;
