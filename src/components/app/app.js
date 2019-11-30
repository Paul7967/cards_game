import React, { Component } from 'react';
import CardsField from '../cards-field';
import GetPicturesArray from './fill-arr-functions';
import AppHeader from './app-header';
import './app.sass'

export default class App extends Component {
	
	state = {
		cards: GetPicturesArray(18),
		active_pair_of_cards: [],
		pair_is_seeking: false,      // идет поиск пары, т.е. перевернута одна картинка
		rount_timer: 0
	}

	onCardClick = (cardNum) => {
		// проверить если кликнутая карта уже перевернута, то пропустить
		if (this.state.cards[cardNum].hidden) {
			this.setState(({cards, active_pair_of_cards, pair_is_seeking}) => {
				const ToggleCardParam = (cardNum, cards, paramName) => {
					const cardArrayIndex = cardNum;
					const oldCard = cards[cardArrayIndex];
					const newCard = { ...oldCard, [paramName]: !oldCard[paramName]};

					return [
						...cards.slice(0, cardArrayIndex),
						newCard,
						...cards.slice(cardArrayIndex+1)
					]
				};

				var newCards = [...cards];
				const newActive_pair_of_cards = [...active_pair_of_cards];
				let newPair_is_seeking = pair_is_seeking;
				
				switch(newActive_pair_of_cards.length) { 
					case 0: { // ни одна карта не перевернута:
						// кладем в массив первую карту и переворачиваем ее
						newActive_pair_of_cards.push(cardNum);
						newCards = ToggleCardParam(cardNum, newCards, 'hidden');
						// запускаем счетчик
						newPair_is_seeking = true;
						break; 
					} 
					case 1: { 
						// одна карта уже перевернута: 
						//   1. кладем в массив вторую карту и переворачиваем ее
						newActive_pair_of_cards.push(cardNum);
						newCards = ToggleCardParam(cardNum, newCards, 'hidden');
						//	 2. сравниваем карты, если:
						const picNumFunc = (id) => newCards[newActive_pair_of_cards[id]].picNum;
						if (picNumFunc(0)===picNumFunc(1)) {
						//	- одинаковые, то фиксируем 
						newCards = ToggleCardParam(newActive_pair_of_cards[0], newCards, 'fixed');
						newCards = ToggleCardParam(newActive_pair_of_cards[1], newCards, 'fixed');
					} else {
						//  - разные, то переворачиваем обе
							newCards = ToggleCardParam(newActive_pair_of_cards[0], newCards, 'hidden');
							newCards = ToggleCardParam(newActive_pair_of_cards[1], newCards, 'hidden');
						}
						newActive_pair_of_cards.length = 0; //   3. чистим массив с перевернутыми карточками
						newPair_is_seeking = false;         //   4. сбрасываем счетчик
						
						break; 
					} 
					default: { 
					// заглушка, чтобы нажатие кнопок не работало в случае когда перевернуто
						return;
						break; 
					} 
				}; 

				return {
					cards: newCards,
					active_pair_of_cards: newActive_pair_of_cards,
					pair_is_seeking: newPair_is_seeking
				}
			});
		};
	};

	render() {
		return (
			<div className="app" >
				<AppHeader />
				<CardsField 
					data={this.state.cards} 
					onCardClick={ this.onCardClick} />
			</div>
		)
	}
}

