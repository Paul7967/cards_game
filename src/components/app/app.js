import React, { Component } from 'react';
import CardsField from '../cards-field';
import GetPicturesArray from './fill-arr-functions';
import AppHeader from '../app-header';
import './app.sass'

export default class App extends Component {
	
	state = {
		cards: GetPicturesArray(18),
		active_pair_of_cards: [],
		pair_is_seeking: false,      // идет поиск пары, т.е. перевернута одна картинка
		card_timer_value: 0,    // значение таймера между открытием первой и второй карточки
		card_timer: null
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
		if (this.state.cards[cardNum].hidden) {
			this.setState(({cards, active_pair_of_cards, pair_is_seeking}) => {

				let newCards = [...cards];
				const newActive_pair_of_cards = [...active_pair_of_cards];
				let newPair_is_seeking = pair_is_seeking;
				
				switch(newActive_pair_of_cards.length) { 
					case 0: { // ни одна карта не перевернута:
						// кладем в массив первую карту и переворачиваем ее
						newActive_pair_of_cards.push(cardNum);
						newCards = this.ToggleCardParam(cardNum, newCards, 'hidden');
						// запускаем счетчик
						newPair_is_seeking = true;
						// this.startCardTimer();
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
						//	- одинаковые, то фиксируем 
						newCards = this.ToggleCardParam(newActive_pair_of_cards[0], newCards, 'deleted');
						newCards = this.ToggleCardParam(newActive_pair_of_cards[1], newCards, 'deleted');
					} else {
						//  - разные, то переворачиваем обе
							newCards = this.ToggleCardParam(newActive_pair_of_cards[0], newCards, 'hidden');
							newCards = this.ToggleCardParam(newActive_pair_of_cards[1], newCards, 'hidden');
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

	startCardTimer = () => {
		
		let timer = setInterval(() => {
			const {card_timer_value} = this.state;
			let timePassed = card_timer_value + 1;
			if (timePassed===5) {
				clearInterval(timer);
				timePassed = 0;
				
				// переворачиваем карточку карточку
				this.setState(() => {
					const {active_pair_of_cards} = this.state;
					const cardNum = active_pair_of_cards[0];
					let newCards = [...this.state.cards];
					newCards[cardNum].hidden = true;
					const newActive_pair_of_cards = [...active_pair_of_cards];
					newActive_pair_of_cards.length = 0;
					return {
						active_pair_of_cards: newActive_pair_of_cards,
						cards: newCards,
						card_timer_value: timePassed
					}
				});
			} 
			this.setState({ card_timer_value: timePassed });
		}, 1000);
		this.setState({card_timer: timer});
	};

	render() {
		return (
			<div className="app" >
				<AppHeader />
				<div>{this.state.card_timer_value}</div>
				<CardsField 
					data={this.state.cards} 
					onCardClick={ this.onCardClick } />
			</div>
		)
	}
}

// onCardClick={ this.onCardClick} />