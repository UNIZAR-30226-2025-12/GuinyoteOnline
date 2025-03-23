import React, { useState } from "react";


const Baraja = ({ controller }) => {
    const [baraja] = useState(controller);

    const spriteSrc = `/assets/Stack_1.png`;

    return (
        <div className="baraja">
            <img src={spriteSrc} alt={`Baraja`} />
        </div>
    );
}

export default Baraja;
