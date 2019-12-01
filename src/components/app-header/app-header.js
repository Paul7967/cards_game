import React from 'react';
import './app-header.sass';

const AppHeader = (props) => {
	const { onStartGame, onStopGame, game_timer_value } = props;
	return (
		<div className="app-header">
			<h1 className="app-header__text">Игра «Память»</h1>
			<input value={game_timer_value} className="app-header__game-timer" readOnly />
			<button type='button' className="app-header__button app-header__button_green" 
				onClick={onStartGame}>
				Старт
			</button>
			<button className="app-header__button app-header__button_red" 
				onClick={onStopGame}>
				Стоп
			</button>
		</div>
	)
};

export default AppHeader;

// <GameTimer />