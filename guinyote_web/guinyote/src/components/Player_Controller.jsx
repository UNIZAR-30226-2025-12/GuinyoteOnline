import React from "react";
import Carta from "./Carta";
import '../styles/Game.css';

const Player = ({ controller, cartaJugada, handleCartaClick }) => {
  const spriteSrc = `/assets/Mano.png`;
  const esMiTurno = controller.state.esMiTurno;

  return (
    <>
      <div className="cartaJugada">
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
      <div className="mano">
        <img src={spriteSrc} alt='Mano' />
        <div className="cartas">
        {controller.state.mano.map((carta, index) => (
            carta && (
              <div key={index} className={"carta " +  index}>
                {esMiTurno ? (
                  <Carta
                    id={carta.palo + "_" + carta.numero}
                    key={carta.palo + "_" + carta.numero}
                    palo={carta.palo}
                    numero={carta.numero}
                    callbackClick={() => handleCartaClick(index)}
                    enMano={true}
                  />
                ) : (
                  <Carta
                    id={carta.palo + "_" + carta.numero}
                    key={carta.palo + "_" + carta.numero}
                    palo={carta.palo}
                    numero={carta.numero}
                    callbackClick={() => {}}
                    enMano={false}
                  />
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export default Player;