import React, { useState, useEffect } from "react";
import Carta from "./Card";

const generarBaraja = () => {
  let baraja = [];
  for (let i = 0; i < 40; i++) {
    baraja.push({ palo: i % 4, numero: i / 4 });
  }
  return baraja;
};

const Baraja = () => {
  const [cartas, setCartas] = useState(generarBaraja());

  // Función para barajar el mazo
  const barajar = () => {
    let cartasMezcladas = [...cartas];
    for (let i = cartasMezcladas.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cartasMezcladas[i], cartasMezcladas[j]] = [cartasMezcladas[j], cartasMezcladas[i]];
    }
    setCartas(cartasMezcladas);
  };

  // Función para repartir una carta
  const darCarta = () => {
    if (cartas.length === 0) {
      console.log("No quedan cartas en la baraja");
      return null;
    }
    const nuevaCarta = cartas[0];
    setCartas(cartas.slice(1)); // Remueve la primera carta
    return nuevaCarta;
  };

  // Función para recoger todas las cartas y resetear la baraja
  const recogerCartas = () => {
    setCartas(generarBaraja());
  };

  // Función para agregar una carta al final del mazo
  const anyadirAlFinal = (carta) => {
    const numero = carta.numero <= 7 ? carta.numero - 1 : carta.numero - 3;
    setCartas([...cartas, { palo: carta.palo, numero }]);
  };

  // Función para eliminar la última carta
  const eliminarUltima = () => {
    setCartas(cartas.slice(0, -1));
  };

  return (
    <div className="baraja">
      <button onClick={barajar} className="bg-blue-500 text-white p-2 m-2">Barajar</button>
      <button onClick={recogerCartas} className="bg-green-500 text-white p-2 m-2">Recoger</button>
      <button onClick={darCarta} className="bg-red-500 text-white p-2 m-2">Dar Carta</button>
      <div className="cartas-grid">
        {cartas.map((carta, index) => (
          <Carta key={index} palo={carta.palo} numero={Math.floor(carta.numero)} />
        ))}
      </div>

    </div>
  );
};

export default Baraja;
