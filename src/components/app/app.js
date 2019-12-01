import React, { Component } from 'react';
import CardsField from '../cards-field';
import GetPicturesArray from './fill-arr-functions';
import './app.sass'
import GameTimer from '../game-timer/game-timer';

export default class App extends Component {
	
	state = {
		cards: GetPicturesArray(18),
		active_pair_of_cards: [],
		founded_pairs_count: 0,      // количество найденных пар
		pair_is_seeking: false,      // идет поиск пары, т.е. перевернута одна картинка
		timerVal: 0,
		timerId: null
	}

	active_pair_of_cards = [];
	

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

	
	putCardToState = (changedCard) => {
		const {cards } = this.state;
		
		const cardNum = changedCard.cardNum;

		const newCards = [
			...cards.slice(0, cardNum),
			changedCard,
			...cards.slice(cardNum+1)
		]

		this.setState({
			cards: newCards
		});
	};

	pushCardNumToAcivePairArr = (cardNum) => {
		const newActive_pair_of_cards = [...this.state.active_pair_of_cards];
		newActive_pair_of_cards.push(cardNum);
		this.setState({active_pair_of_cards: newActive_pair_of_cards});
	};

	compareAndHandleCards = () => {
		const { cards } = this.state;
		const picNumFunc = (id) => cards[this.active_pair_of_cards[id]].picNum;

		if (picNumFunc(0)===picNumFunc(1)) {   // если картинки на картах одинаковые
			// увеличиваем счетчик найденных пар 
			const newFounded_pairs_count = this.state.founded_pairs_count + 1;
			this.setState({founded_pairs_count: newFounded_pairs_count});
			// удаляем карты с поля
			this.putCardToState({
				'cardNum':this.active_pair_of_cards[0], 
				'picNum':this.state.cards[this.active_pair_of_cards[0]].picNum,
				'hidden':true,
				'deleted':true,
				'selected':false
			});
			
			this.putCardToState({
				'cardNum':this.active_pair_of_cards[1], 
				'picNum':this.state.cards[this.active_pair_of_cards[1]].picNum,
				'hidden':true,
				'deleted':true,
				'selected':false
			});
			this.active_pair_of_cards.length = 0;
		} else { // если картинки на картах разные
			// переворачиваем обе карты
			this.putCardToState({
				'cardNum':this.active_pair_of_cards[0], 
				'picNum':this.state.cards[this.active_pair_of_cards[0]].picNum,
				'hidden':true,
				'deleted':false,
				'selected':false
			});
			
			this.putCardToState({
				'cardNum':this.active_pair_of_cards[1], 
				'picNum':this.state.cards[this.active_pair_of_cards[1]].picNum,
				'hidden':true,
				'deleted':false,
				'selected':false
			});
			this.active_pair_of_cards.length = 0;
		}


	};

	onCardClick = (cardNum) => {
		if ( (!this.gameStarted()) || (this.active_pair_of_cards.length >=2) ) return;

		if  (this.state.cards[cardNum].hidden) {
			this.putCardToState({
				'cardNum':cardNum, 
				'picNum':this.state.cards[cardNum].picNum,
				'hidden':false, 
				'deleted':false,
				'selected':true
			});

			// this.pushCardNumToAcivePairArr(cardNum);
			this.active_pair_of_cards.push(cardNum);
		}
		
		if (this.active_pair_of_cards.length === 2) {    // если перевернута 2я карта
			
			setTimeout(() => {
				this.compareAndHandleCards();
				}, 1000);
		}
	}

	onCardClick1 = (cardNum) => {
		
		if (!this.gameStarted) return;

		// проверить если кликнутая карта уже перевернута, то пропустить
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

	gameStarted = () => {
		if (this.state.timerId === null) {
			alert('Для начала игры нажмите кнопку «Старт»');
			return false;
		}
		return true;
	}

	runTimer = () => {
		const {timerId} = this.state;
		
		if (timerId!==null) {
			clearInterval(timerId);
		};
		
		this.setState({timerVal: 0});

		const timer_Id = setInterval(() => {
			const timerValue = this.state.timerVal+1;
			this.setState({	timerVal: timerValue });
		}, 1000);

		this.setState({timerId: timer_Id});
	}

	stopTimer = () => {
		const {timerId} = this.state;
		
		if (timerId!==null) {
			clearInterval(timerId);
			this.setState({timerId: null});
		};
	}

	onGameStart = () => {
		this.runTimer();		

		this.setState(({active_pair_of_cards}) => {
			const newActive_pair_of_cards = [...active_pair_of_cards];
			newActive_pair_of_cards.length = 0;
			
			return {
				cards: GetPicturesArray(18),
				active_pair_of_cards: newActive_pair_of_cards
			}
		});
	}

	onGameStop = () => {
		this.stopTimer();
	}

	gameFinish = () => {
		alert('Поздравляем, ваше время: ', this.state.timerVal)
	}

	render() {
		const { cards, founded_pairs_count } = this.state; 
		return (
			<div className="app" >
				<div>
					<GameTimer 
						timerVal={this.state.timerVal} 
						onGameStart={this.onGameStart}
						onGameStop={this.onGameStop}
					/>
					<div style={{ width: "180px", display: "block", justifyCcontent: "space-around"}} > 
						{`Найденных пар: ${founded_pairs_count}`}
					</div>
				</div>
				
				<CardsField 
					data={ cards } 
					onCardClick={ this.onCardClick } />
			</div>
		)
	}
}
