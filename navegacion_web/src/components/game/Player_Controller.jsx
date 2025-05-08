import React, { useState } from "react";
import Carta from "./Carta";
import '/src/styles/Game.css';

const Player = ({ controller, cartaJugada, handleCartaClick, handleCambiarSiete }) => {
  const spriteSrc = `/src/assets/Mano.png`;
  const esMiTurno = controller.state.esMiTurno;

  const [isHovered, setIsHovered] = useState([false, false, false, false, false]);

  const palos = [ "bastos", "copas", "espadas", "oros" ];

  const handleMouseEnter = (index) => {
    const newHovered = [...isHovered]; // Copia del array
    newHovered[index] = true; 
    setIsHovered(newHovered);
  };

  const handleMouseLeave = (index) => {
    const newHovered = [...isHovered];
    newHovered[index] = false; 
    setIsHovered(newHovered); 
  };

  return (
    <>
      {palos.map((palo, index) => (
        <button
          key={index}
          className={`boton cantar${palo} ${
            controller.state.sePuedeCantar[index]
              ? isHovered[index]
                ? "hover"
                : "activo"
              : "inactivo"
          }`}
          onMouseEnter={() => handleMouseEnter(index)} // Activa el hover
          onMouseLeave={() => handleMouseLeave(index)} // Desactiva el hover
          onClick={() => {
            if (controller.state.sePuedeCantar[index]) {
              controller.cantar(index);
              console.log(`Cantar activado para ${palo}`);
            } else {
              console.log(`Cantar desactivado para ${palo}`);
            }
          }}
        >
          Cantar {palo}
        </button>
      ))}
      <button
          className={`boton siete ${
            esMiTurno && controller.state.sePuedeCambiarSiete
              ? isHovered[4]
                ? "hover"
                : "activo"
              : "inactivo"
          }`}
          onMouseEnter={() => handleMouseEnter(4)} // Activa el hover
          onMouseLeave={() => handleMouseLeave(4)} // Desactiva el hover
          onClick={() => {
            if (controller.state.sePuedeCambiarSiete) {
              handleCambiarSiete();
              console.log(`Cambiar siete activado`);
            } else {
              console.log(`Cambiar siete desactivado`);
            }
          }}
        >
          Cambiar siete
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