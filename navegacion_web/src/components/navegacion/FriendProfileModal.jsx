import React from 'react';
import Modal from 'react-modal';

// ! NOT DONE YET, try all the options

const ReadOnlyProfileModal = ({ isOpen, onClose, friendData }) => {
    if (!friendData) return null;

    const { avatar, name, victories, gameMatImage, cardBackImage } = friendData;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Read-Only Profile Modal"
            className="read-only-profile-modal"
            overlayClassName="read-only-profile-overlay"
        >
            <div className="read-only-profile-container">
                <div className="read-only-profile-content">
                    <img src={avatar} alt={`${name}'s avatar`} className="friend-avatar" />
                    <h2 className="friend-name">{name}</h2>
                    <p className="friend-victories">Victories: {victories}</p>
                    <div className="friend-images">
                        <img src={gameMatImage} alt="Game Mat" className="game-mat-image" />
                        <img src={cardBackImage} alt="Card Back" className="card-back-image" />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReadOnlyProfileModal;
