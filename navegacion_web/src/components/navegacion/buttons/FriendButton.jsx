import React, { Component } from 'react';
import friendsButtonIcon from '/src/assets/friends_button.png';
import CommonButton from './base_buttons/CommonButton';

class FriendButton extends Component {
    render() {
        const { onClick } = this.props;
        return (
            <CommonButton imagePath={friendsButtonIcon} buttonText='Amigos' onClick={onClick} />
        );
    }
}

export default FriendButton;