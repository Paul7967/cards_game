import React, { Component } from 'react';
import './card.sass';

export default class Card extends Component {
	
	shouldComponentUpdate(nextProps) {
		const { hidden, deleted, selected } = this.props;
		if ((hidden===nextProps.hidden)&&(deleted===nextProps.deleted)&&(selected===nextProps.selected)) {
			return false;
		} else {
			return true;
		}

	}

	render() { 
		const { picNum, onCardClick, hidden, deleted, selected } = this.props;
		
		let imgClassNames = 'card__img';
		let divClassName = 'card';
		
		if (deleted) {
			divClassName += ' card_deleted';
		} 
		else if (hidden) {
			imgClassNames += ' card__img_hidden';
		} else if (selected) {
			imgClassNames += ' card__img_selected'
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
	}
	
};

