import React from 'react';

const FriendsRow = ({ img, userName, mail }) => {
    return (
        <div className="friend-row">
            <p>{img}</p>
            <p>{userName}</p>
            <p>{mail}</p>
        </div>
    );
};

export default FriendsRow;