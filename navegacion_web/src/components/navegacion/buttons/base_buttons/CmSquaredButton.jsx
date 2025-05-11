import React from 'react';
import '/src/styles/CmSquaredButton.css';

class CmSquaredButton extends React.Component {
    render() {
        const { buttonText, onClick } = this.props;
        return (
            <button className='cm_squared_button' onClick={onClick}>
                {buttonText}
            </button>
        );
    }
}

export default CmSquaredButton;