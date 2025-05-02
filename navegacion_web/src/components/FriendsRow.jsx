import React from 'react';
import '../styles/FriendsRow.css';
const assetsUrl = '/src/assets/';
const avataresUrl = '/src/assets/avatares/';

const FriendsRow = ({ img, username, mail, onClickOptions }) => {

    const handleOnClick = () => {
        onClickOptions(mail);
    }

    return (
        <tr key={mail} className='friend-row'>
            <td><img src={avataresUrl + img} alt="avatar" /></td>
            <td><p>{username}</p></td>
            <td>
                <button onClick={handleOnClick} className='friend-row-options'>
                    <img src={assetsUrl + "options.png"} alt="options.png" />
                </button>
            </td>
        </tr>
    );
};

export default FriendsRow;