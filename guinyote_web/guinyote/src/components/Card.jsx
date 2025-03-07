import React, { useState, useEffect } from "react";

const traduccionPalos = ["B", "C", "E", "O"];

const Carta = ({ palo, numero }) => {
  const [puntos, setPuntos] = useState(0);
  const [paloReal, setPaloReal] = useState(palo);
  const [numeroReal, setNumeroReal] = useState(numero);
  const [imagenSrc, setImagenSrc] = useState("");

  useEffect(() => {
    // Ajustar número según la lógica del juego
    const nuevoNumero = numero < 7 ? numero + 1 : numero + 3;
    setNumeroReal(nuevoNumero);

    // Calcular puntos según las reglas
    let nuevosPuntos = 0;
    switch (nuevoNumero) {
      case 1:
        nuevosPuntos = 11;
        break;
      case 3:
        nuevosPuntos = 10;
        break;
      case 12:
        nuevosPuntos = 4;
        break;
      case 10:
        nuevosPuntos = 3;
        break;
      case 11:
        nuevosPuntos = 2;
        break;
      default:
        nuevosPuntos = 0;
        break;
    }
    setPuntos(nuevosPuntos);

    // Generar la ruta de la imagen
    const paloLetra = traduccionPalos[palo];
    setPaloReal(paloLetra);
    setImagenSrc(`/assets/cartas/${paloLetra}_${nuevoNumero}.png`); // Ajusta la ruta según donde guardes las imágenes
  }, [palo, numero]);

  return (
    <div className="carta">
      <img src={imagenSrc} alt={`Carta ${numeroReal}`} className="w-32 h-48" />
    </div>
  );
};

export default Carta;