import React from 'react';
import './app-header.sass';

const AppHeader = () => {
	return (
		<div className="app-header">
			<h1 className="app-header__text">Игра «Память»</h1>
			<input value={10} className="app-header__timer" readonly />
			<button className="app-header__reset-button" >Сбросить</button>
		</div>
	)
};

export default AppHeader;