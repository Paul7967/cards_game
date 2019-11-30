import React from 'react';
import './cards-field.sass';
import Card from '../card';

const CardsField = (props) => {

	const {data, onCardClick} = props;
	
	const items = data.map((item) => {
			const { ...itemProps } = item;

			return (
				<Card key={item.cardNum} { ...itemProps } 
					onCardClick={ () => onCardClick(item.cardNum) }
				/>
			)
		})
	
	return (
		<div className="cards-field">
			{items}
		</div>
	);

};

export default CardsField;

