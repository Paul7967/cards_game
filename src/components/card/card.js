import React from 'react';
import './card.sass';

const Card = (props) => {
	
		const { picNum, onCardClick, hidden, deleted } = props;

		let imgClassNames = 'card__img';
		let divClassName = 'card';
		
		if (deleted) {
			divClassName += ' card_deleted';
		} 
		else if (hidden) {
			imgClassNames += ' card__img_hidden';
		}

		const ImgEl = () => {
			if (!deleted) {
				
				return (
					<img src={`img/${picNum}.jpg`} alt={`${picNum}`} className={imgClassNames} />
				)	
			} else {
				return <div></div>;
			}
		};

		return (
			<div className={divClassName}
				onClick={ onCardClick } >
				<ImgEl />
			</div> 
			
		)
	
};

export default Card;


