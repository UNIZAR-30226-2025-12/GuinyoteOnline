import React, { Component } from 'react';
import CommonButton from './CommonButton';
import rankingButtonIcon from '../assets/ranking_button.png';

class RankingButton extends Component {
    render() {
        const { onClick } = this.props;
        return (
            <CommonButton imagePath={rankingButtonIcon} buttonText='Ranking' onClick={onClick} />
        );
    }
}

export default RankingButton;