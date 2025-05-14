import React, { useEffect } from "react";
import Carta from "./Carta";
import '/src/styles/Game.css';

const Online_Player = ({ controller, numPlayer, cartaJugada }) => {
  const spriteSrc = `/src/assets/Mano.png`;
  const esMiTurno = controller.state.esMiTurno;


  // * ESTO NO DEBERÍA HACER FALTA
  /*useEffect(() => {
    
      if (esMiTurno) {

        // RESET
        controller.reset();

        if(controller.state.ganador){
          // CANTAR
          controller.intentarCantar();
          if (controller.state.cantadoEsteTurno) {
            console.log("CANTANDO IA");
            handleCantar(controller.state.paloCantadoEsteTurno);
          }

          // CAMBIO SIETE
          controller.intentarCambiarSiete();
          if (controller.state.sieteCambiado) {
            console.log("SIETE CAMBIADO IA");
            handleCambiarSiete();
          }
        }

        // JUGAR CARTA
        let index = controller.turnoLogic(null);
        handleCartaClick(index);
      }

  }, [esMiTurno, controller.state.gameManager.state.turnManager.state.playerTurn]);*/

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
                {esMiTurno ? (
                  <Carta
                    id={carta.palo + "_" + carta.numero}
                    key={carta.palo + "_" + carta.numero}
                    palo={carta.palo}
                    numero={carta.numero}
                    callbackClick={() => {}}
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

export default Online_Player;
