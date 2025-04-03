import React from "react";
import Carta from "./Carta";
import '../styles/Game.css';



const Player = ({ controller, cartaJugada, handleCartaClick }) => {
  const spriteSrc = `/assets/Mano.png`;
  const esMiTurno = controller.state.esMiTurno;

  return (
    <>
      <button className="botonCantar"
        style={{
          backgroundColor: controller.state.sePuedeCantar ? "green" : "gray",
          color: "white",
          border: `2px solid ${controller.state.sePuedeCantar ? "darkgreen" : "darkgray"}`,
        }}
        onClick={() => {
          if (esCantarActivo) {
            console.log("Cantar activado");
          }
        }}
      >
        Cantar
      </button>
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