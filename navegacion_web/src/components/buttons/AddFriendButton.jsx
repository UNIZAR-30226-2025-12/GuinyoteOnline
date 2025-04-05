import React from 'react';

const AddFriendButton = ({ onAddFriend }) => {
    const handleClick = () => {
        if (onAddFriend) {
            onAddFriend();
        }
    };

    return (
        <button onClick={handleClick} className="add-friend-button">
            Add Friend
        </button>
    );
};

export default AddFriendButton;