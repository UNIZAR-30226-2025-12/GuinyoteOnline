import { useState } from "react";
import '/src/styles/Carta.css'

const traduccion = ["B", "C", "E", "O"];

const Carta = ({ palo, numero, callbackClick, enMano = false, puntos}) => {
  const [mouseEncima, setMouseEncima] = useState(false);

  let numeroReal = numero < 7 ? numero + 1 : numero + 3;

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
