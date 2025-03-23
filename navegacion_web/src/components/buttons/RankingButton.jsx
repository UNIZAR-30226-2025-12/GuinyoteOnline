import React, { Component } from 'react';
import CommonButton from './base_buttons/CommonButton';
import rankingButtonIcon from '/src/assets/ranking_button.png';

class RankingButton extends Component {
    render() {
        const { onClick } = this.props;
        return (
            <CommonButton imagePath={rankingButtonIcon} buttonText='Ranking' onClick={onClick} />
        );
    }
}

export default RankingButton;