import { useState } from "react";
import '../styles/Carta.css'

const traduccion = ["B", "C", "E", "O"];

const Carta = ({ palo, numero, callbackClick, enMano = false}) => {
  const [mouseEncima, setMouseEncima] = useState(false);

  let numeroReal = numero < 7 ? numero + 1 : numero + 3;
  let puntos = 0;

  switch (numeroReal) {
    case 1:
      puntos = 11;
      break;
    case 3:
      puntos = 10;
      break;
    case 12:
      puntos = 4;
      break;
    case 10:
      puntos = 3;
      break;
    case 11:
      puntos = 2;
      break;
    default:
      puntos = 0;
      break;
  }

  const spriteSrc = `/assets/cartas/${traduccion[palo]}_${numeroReal}.png`;

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
