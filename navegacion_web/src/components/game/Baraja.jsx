import React, { useState } from "react";
import { useUser } from "../../context/UserContext";

const Baraja = () => {
    const { stack } = useUser() ;

    const spriteSrc = `/assets/stacks/${stack}`;

    return (
        <div className="baraja">
            <img src={spriteSrc} alt={`Baraja`} />
        </div>
    );
}

export default Baraja;
