import React from 'react';
import '/src/styles/CmRoundButton.css';

class CmRoundButton extends React.Component {
    render() {
        const { buttonText, onClick } = this.props;
        return (
            <button className='cm_round_button' onClick={onClick}>
                {buttonText}
            </button>
        );
    }
}

export default CmRoundButton;