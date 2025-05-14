import React, { useEffect } from "react";
import Carta from "./Carta";
import '/src/styles/Game.css';

const Online_Player = ({ controller, numPlayer, cartaJugada }) => {
  const spriteSrc = `/assets/Mano.png`;
  const esMiTurno = controller.state.esMiTurno;

  return (
    <>
      <div className={"cartaJugadaIA_" + numPlayer}>
        {cartaJugada && (
          <Carta
            id={cartaJugada.id}
            key={cartaJugada.id}
            palo={cartaJugada.palo}
            numero={cartaJugada.numero}
            callbackClick={() => { }}
            enMano={false}
          />
        )}
      </div>
      <div className={"manoIA_" + numPlayer}>
        <img src={spriteSrc} alt='Mano' />
        <div className={"cartasIA_" + numPlayer}>
        {controller.state.mano.map((carta, index) => (
            carta && (
              <div key={index} className={"carta " +  index}>
                  <Carta
                    id={carta.palo + "_" + carta.numero}
                    key={carta.palo + "_" + carta.numero}
                    palo={carta.palo}
                    numero={carta.numero}
                    callbackClick={() => {}}
                    enMano={false}
                    visible={false}
                  />
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export default Online_Player;
