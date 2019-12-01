import React, { Component } from 'react';
import "./game-timer.sass";

export default class GameTimer extends Component {
	
	state = {
		timerVal: 0,
		timerLaunched: false,
		timerId: null
	};

	componentWillUnmount() {
		const {timerId} = this.state;
		
		if (timerId!==null) {
			clearInterval(timerId);
		};
	};

	onStartGame = () => {
		
		const {timerId} = this.state;
		
		if (timerId!==null) {
			clearInterval(timerId);
		};

		this.setState(() => {
			return {
				timerVal:0,
				timerLaunched: true
			}
		});
		
		const timer_Id = setInterval(() => {
			const timerValue = this.state.timerVal+1;
			this.setState({	timerVal: timerValue });
		}, 1000);
		
		this.setState({timerId: timer_Id});

		const { onGameStart } = this.props;

		onGameStart();
		
	};

	onStopGame = () => {
		const {timerId} = this.state;
		if (timerId!==null) {
			clearInterval(timerId);
		};

		this.setState({
			timerVal:0,
			timerId:null
		});
	}

	render() {
	
		return (
			<div className="game-timer">
				<input value={this.state.timerVal} className="game-timer__text" readOnly />
				<button 
					className="app-header__button app-header__button_green"
					onClick={this.onStartGame} type='button' >
					Старт
				</button>
				<button 
					className="app-header__button app-header__button_red" 
					onClick={this.onStopGame} type='button' >
					Стоп
				</button>
			</div>
		)
	}
}