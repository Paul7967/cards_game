import React, { Component } from 'react';
import './card.sass';

const Card = (props) => {
	
	
		const { picNum, onCardClick, hidden } = props;

		let imgClassNames = 'card__img';
		if (hidden) {
			imgClassNames += ' card__img_hidden';
		}

		return (
			<div className="card"
				onClick={ onCardClick } >
				<img src={`img/${picNum}.jpg`} alt="planet" className={imgClassNames} />
			</div> 
			
		)
	
};

export default Card;
// export default class Card extends Component {
	
// 	render() {
// 		const { picNum, onCardClick, hidden } = this.props;

// 		let imgClassNames = 'card__img';
// 		if (hidden) {
// 			imgClassNames += ' card__img_hidden';
// 		}

// 		return (
// 			<div className="card"
// 				onClick={ onCardClick } >
// 				<img src={`img/${picNum}.jpg`} alt="planet" className={imgClassNames} />
// 			</div> 
			
// 		)
// 	}
// };

