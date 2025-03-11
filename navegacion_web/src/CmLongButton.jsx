import React from 'react';
import './CmLongButton.css';

class CmLongButton extends React.Component {
    render() {
        const { buttonText, onClick } = this.props;
        return (
            <button className='cm_long_button' onClick={onClick}>
                {buttonText}
            </button>
        );
    }
}

export default CmLongButton;