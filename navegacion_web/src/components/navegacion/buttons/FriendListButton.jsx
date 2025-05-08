import React from 'react';
import FriendsCommonButton from './base_buttons/FriendsCommonButton';

class FriendListButton extends React.Component {

    render() {
        const { onClick } = this.props;
        return (
            <FriendsCommonButton label='Lista de amigos' onClick={onClick}/>
        );
    }
}

export default FriendListButton;