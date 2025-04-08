import React from 'react';
import '../styles/FriendsRow.css';
const assetsUrl = '/src/assets/';

const FriendsRow = ({ img, username, mail, onClickOptions }) => {

    const handleOnClick = () => {
        onClickOptions(mail);
    }

    return (
        <tr key={mail} className='friend-row'>
            <img src={assetsUrl + img} alt="avatar" />
            <p>{username}</p>
            <button onClick={handleOnClick} className='friend-row-options'>
                <img src={assetsUrl + "options.png"} alt="options.png" />
            </button>
        </tr>
    );
};

export default FriendsRow;