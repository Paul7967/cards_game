import React, { Component } from 'react';
import CardsField from '../cards-field';
import GetPicturesArray from './fill-arr-functions';
import AppHeader from '../app-header';
import './app.sass'
import GameTimer from '../game-timer/game-timer';

export default class App extends Component {
	
	state = {
		cards: GetPicturesArray(18),
		active_pair_of_cards: [],
		game_started: false,
		founded_pairs_count: 0,      // количество найденных пар
		pair_is_seeking: false      // идет поиск пары, т.е. перевернута одна картинка
	}

	ToggleCardParam = (cardNum, cards, paramName) => {
		const cardArrayIndex = cardNum;
		const oldCard = cards[cardArrayIndex];
		const newCard = { ...oldCard, [paramName]: !oldCard[paramName]};

		return [
			...cards.slice(0, cardArrayIndex),
			newCard,
			...cards.slice(cardArrayIndex+1)
		]
	};

	onCardClick = (cardNum) => {
		// проверить если кликнутая карта уже перевернута, то пропустить
		if (!this.state.game_started) {
			alert('Для начала игры нажмите кнопку «Старт»');
			return;
		}


		if (this.state.cards[cardNum].hidden) {
			this.setState(({cards, active_pair_of_cards, pair_is_seeking, founded_pairs_count}) => {

				let newCards = [...cards];
				const newActive_pair_of_cards = [...active_pair_of_cards];
				let newPair_is_seeking = pair_is_seeking;
				let newFounded_pairs_count = founded_pairs_count;

				switch(newActive_pair_of_cards.length) { 
					case 0: { // ни одна карта не перевернута:
						// кладем в массив первую карту и переворачиваем ее
						newActive_pair_of_cards.push(cardNum);
						newCards = this.ToggleCardParam(cardNum, newCards, 'hidden');
						// newCards = this.ToggleCardParam(cardNum, newCards, 'selected');
						newCards[cardNum].selected = true;
						// запускаем счетчик
						newPair_is_seeking = true;
						break; 
					} 
					case 1: { 
						// clearInterval(this.state.timer);
						// одна карта уже перевернута: 
						//   1. кладем в массив вторую карту и переворачиваем ее
						newActive_pair_of_cards.push(cardNum);
						newCards = this.ToggleCardParam(cardNum, newCards, 'hidden');
						//	 2. сравниваем карты, если:
						const picNumFunc = (id) => newCards[newActive_pair_of_cards[id]].picNum;
						if (picNumFunc(0)===picNumFunc(1)) {
							//	- одинаковые, то удаляем и увеличиваем счетчик найденных пар 
							newFounded_pairs_count += 1;
							newCards = this.ToggleCardParam(newActive_pair_of_cards[0], newCards, 'deleted');
							newCards = this.ToggleCardParam(newActive_pair_of_cards[1], newCards, 'deleted');
						} else {
						//  - разные, то переворачиваем обе
							newCards = this.ToggleCardParam(newActive_pair_of_cards[0], newCards, 'hidden');
							newCards = this.ToggleCardParam(newActive_pair_of_cards[1], newCards, 'hidden');
						}
						newCards[newActive_pair_of_cards[0]].selected = false;
						newCards[newActive_pair_of_cards[1]].selected = false;

						newActive_pair_of_cards.length = 0; //   3. чистим массив с перевернутыми карточками
						newPair_is_seeking = false;         //   4. сбрасываем счетчик
						
						break; 
					} 
					default: { 
					// заглушка, чтобы нажатие кнопок не работало в случае когда перевернуто
						return;
					} 
				}; 

				return {
					cards: newCards,
					active_pair_of_cards: newActive_pair_of_cards,
					pair_is_seeking: newPair_is_seeking,
					founded_pairs_count: newFounded_pairs_count 
				}
			});
		};
	};

	onGameStart = () => {
		
		this.setState(({active_pair_of_cards}) => {
			const newActive_pair_of_cards = [...active_pair_of_cards];
			newActive_pair_of_cards.length = 0;
			
			return {
				cards: GetPicturesArray(18),
				active_pair_of_cards: newActive_pair_of_cards,
				game_started: true
			}
		});
	}

	gameFinish = () => {

	}

	render() {
		const { cards, founded_pairs_count } = this.state; 
		return (
			<div className="app" >
				<div>
					<GameTimer onGameStart={this.onGameStart} />
					<div style={{ width: "180px", display: "block", "justify-content": "space-around"}} >`Найденных пар: {founded_pairs_count}`</div>
				</div>
				<CardsField 
					data={ cards } 
					onCardClick={ this.onCardClick } />
			</div>
		)
	}
}



/* <AppHeader 
					onStartGame={this.onStartGame} 
					onStopGame={this.onStopGame} 
					game_timer_value={1} /> */