import React from 'react';
import '/src/styles/CommonButton.css';

class CommonButton extends React.Component {
    render() {
        const { imagePath, buttonText, className, onClick } = this.props;
        return (
            <button className={`cb_button ${className}`} onClick={onClick}>
                <img className='cb_img' src={imagePath} alt={buttonText} />
                {buttonText}
            </button>
        );
    }
}

export default CommonButton;