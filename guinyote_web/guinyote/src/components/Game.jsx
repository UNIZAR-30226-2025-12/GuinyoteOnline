import React from "react";
import Baraja from "./Baraja";

const Game = () => {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Juego de Cartas</h1>
      <Baraja />
    </div>
  );
};

export default Game;