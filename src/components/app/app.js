import React, { Component } from 'react';
import CardsField from '../cards-field';
import GetPicturesArray from './fill-arr-functions';
import './app.sass'
import GameTimer from '../game-timer/game-timer';

export default class App extends Component {
	
	countPairs = 18;

	state = {
		cards: GetPicturesArray(this.countPairs),
		founded_pairs_count: 0,      // количество найденных пар
		pair_is_seeking: false,      // идет поиск пары, т.е. перевернута одна картинка
		timerVal: 0,
		timerId: null
	}

	active_pair_of_cards = [];
	
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
			
			if (newFounded_pairs_count===this.countPairs) {
				this.gameWin(this.resetCardsField);
			}
		
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
		
		let timerId;
		if (this.active_pair_of_cards.length === 1) {	// если перевернута 1я карта
			timerId = setTimeout(this.checkLonleyCard, 5000, cardNum);
		}

		if (this.active_pair_of_cards.length === 2) {    // если перевернута 2я карта
			clearInterval(timerId);
			setTimeout(() => {
				this.compareAndHandleCards();
				}, 1000);
		}
	}

	checkLonleyCard = (cardNum) => {
		if ((this.active_pair_of_cards.length === 1)&&(this.active_pair_of_cards[0] === cardNum)) {
			this.active_pair_of_cards.length = 0;
			this.putCardToState({
				'cardNum':cardNum, 
				'picNum':this.state.cards[cardNum].picNum,
				'hidden':true, 
				'deleted':false,
				'selected':true
			});
		}
	}

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

	resetCardsField = () => {
		this.active_pair_of_cards.length = 0;
		this.setState({ cards: GetPicturesArray(this.countPairs), timerVal: 0 });
		this.stopTimer();
	}

	onGameStart = () => {
		this.resetCardsField();
		this.runTimer();		
	}

	onGameStop = () => {
		this.stopTimer();
	}

	gameWin = (callback) => {
		alert(`Поздравляем, ваше время: ${this.state.timerVal} секунд`);
		callback();
	}

	render() {
		const { cards, founded_pairs_count } = this.state; 
		return (
			<div className="app" >
				<div className={"app__header"}>
					<GameTimer 
						timerVal={this.state.timerVal} 
						onGameStart={this.onGameStart}
						onGameStop={this.onGameStop}
					/>
					<div className={"app__text"}> 
						{`Найденно пар: ${founded_pairs_count} из ${this.countPairs}`}
					</div>
				</div>
				
				<CardsField 
					data={ cards } 
					onCardClick={ this.onCardClick } />
			</div>
		)
	}
}
