import React from 'react';
import punta_flecha from '/src/assets/punta_flecha.png';
import '/src/styles/FriendsCommonButton.css';

class FriendsCommonButton extends React.Component {

    render() {
        const { label, onClick } = this.props;
        
        return (
            <button className='friends-common-button' onClick={onClick}>
                {label}
                <img className='friends-common-button-icon' src={punta_flecha} alt="icon" />
            </button>
        );
    }
}

export default FriendsCommonButton;