import React from 'react';
import './app-header.sass';
import GameTimer from '../game-timer';

const AppHeader = () => {
	return (
		<div className="app-header">
			<h1 className="app-header__text">Игра «Память»</h1>
			<GameTimer />
			<button className="app-header__reset-button" >Сбросить</button>
		</div>
	)
};

export default AppHeader;

