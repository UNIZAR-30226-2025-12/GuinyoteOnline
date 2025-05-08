import React from 'react';

const AddFriendButton = ({ onClick }) => {

    return (
        <button onClick={onClick} className="add-friend-button">
            Añadir amigo
        </button>
    );
};

export default AddFriendButton;