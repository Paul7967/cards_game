import React, { Component } from 'react';
import "./game-timer.sass";

export default class GameTimer extends Component {
	render() {
		return (
			<input value={this.props.timerVal} className="game-timer" readOnly />
		)
	}
}