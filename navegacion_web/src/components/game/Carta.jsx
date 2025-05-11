/**
 * Carta component
 * - This component represents a playing card in the game.
 * 
 * @param {number} palo - The suit of the card (0-3).
 * @param {number} numero - The number of the card (0-9).
 * @param {function} callbackClick - The function to call when the card is clicked.
 * @param {boolean} enMano - Whether the card is in hand or not.
 * 
 * @returns {JSX.Element} The Carta component.
 * 
 */

import { useState } from "react";
import '/src/styles/Carta.css'

const traduccion = ["B", "C", "E", "O"];

const Carta = ({ palo, numero, callbackClick, enMano = false, puntos}) => {
  const [mouseEncima, setMouseEncima] = useState(false);

  let numeroReal = numero < 7 ? numero + 1 : numero + 3;

  const spriteSrc = `/src/assets/cartas/${traduccion[palo]}_${numeroReal}.png`;

  return (
    <div className={`carta`}
      onMouseEnter={() => setMouseEncima(true)}
      onMouseLeave={() => setMouseEncima(false)}
      onClick={callbackClick}
      style={{
        position: "absolute",
        transform: `${mouseEncima && enMano ? "translateY(-10px)" : "translateY(0px)"}`,
        transition: "transform 0.2s ease",
      }}
    >
      <img
            src={spriteSrc}
            alt={`Carta ${traduccion[palo]} ${numeroReal}`}
        />
    </div>
  );
};

export default Carta;
