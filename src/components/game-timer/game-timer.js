import React from 'react';
import "./game-timer.sass";

const GameTimer = (props) => {
		
	const {timerVal, onGameStart, onGameStop} = props;

	return (
		<div className="game-timer">
			<input value={timerVal} className="game-timer__text" readOnly />
			<button 
				className="game-timer__button game-timer__button_green"
				onClick={onGameStart} type='button' >
				Старт
			</button>
			<button 
				className="game-timer__button game-timer__button_red" 
				onClick={onGameStop} type='button' >
				Стоп
			</button>
		</div>
	)
}

export default GameTimer;