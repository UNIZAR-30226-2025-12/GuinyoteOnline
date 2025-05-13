import React from 'react';
import PlayerSlot from './PlayerSlot';
import '/src/styles/LobbySlots.css'; // Create a CSS file for styling

const LobbySlots = ({ slotCount, playerSlotArgs, handleSlotClick = () => {} }) => {

    const renderSlots = () => {
        const half = Math.ceil(slotCount / 2);

        const topSlots = playerSlotArgs.slice(half, slotCount).map((args, index) => (
            <PlayerSlot key={index} {...args} onClick={handleSlotClick} index={half + index} />
        ));

        const bottomSlots = playerSlotArgs.slice(0, half).map((args, index) => (
            <PlayerSlot key={index} {...args} onClick={handleSlotClick} index={index}/>
        ));

        return (
            <>
                <div className="top-slots">
                    {topSlots}
                </div>
                <div className="team-name team1">Equipo 1</div>
                <div className="vs-text"><i>VS</i></div>
                <div className="team-name team2">Equipo 2</div>
                <div className="bottom-slots">
                    {bottomSlots}
                </div>
            </>
        );
    };

    return <div className="lobby-slots">{renderSlots()}</div>;
};

export default LobbySlots;