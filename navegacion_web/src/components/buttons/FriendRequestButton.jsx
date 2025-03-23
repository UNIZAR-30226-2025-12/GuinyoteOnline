import React from 'react';
import FriendsCommonButton from './base_buttons/FriendsCommonButton';

const FriendRequestButton = ({ onClick }) => {
    return (
        <FriendsCommonButton label='Solicitud de amistad' onClick={onClick} />
    );
};

export default FriendRequestButton;