// Constantes del juego
const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
const VALORES = ['as', '3', 'rey', 'caballo', 'sota', '7', '6', '5', '4', '2'];
const PUNTOS = {
    'as': 11,
    '3': 10,
    'rey': 4,
    'caballo': 3,
    'sota': 2,
    '7': 0,
    '6': 0,
    '5': 0,
    '4': 0,
    '2': 0
};

function barajaTest() {
    const baraja = [];
    //Jugador 1 iniciales
    baraja.push({palo: 0, valor: 7});
    baraja.push({palo: 0, valor: 9});
    baraja.push({palo: 1, valor: 0});
    baraja.push({palo: 0, valor: 6});
    baraja.push({palo: 2, valor: 2});
    baraja.push({palo: 2, valor: 4});
    //Jugador 2 iniciales
    baraja.push({palo: 1, valor: 7});
    baraja.push({palo: 1, valor: 9});
    baraja.push({palo: 1, valor: 6});
    baraja.push({palo: 2, valor: 0});
    baraja.push({palo: 2, valor: 5});
    baraja.push({palo: 3, valor: 1});
    //Jugador 3 iniciales o triunfo y siguientes cartas
    baraja.push({palo: 0, valor: 8});
    baraja.push({palo: 3, valor: 3});
    baraja.push({palo: 2, valor: 8});
    baraja.push({palo: 1, valor: 4});
    baraja.push({palo: 3, valor: 7});
    baraja.push({palo: 3, valor: 9});
    //Jugador 4 iniciales o siguientes cartas
    baraja.push({palo: 1, valor: 2});
    baraja.push({palo: 0, valor: 3});
    baraja.push({palo: 3, valor: 8});
    baraja.push({palo: 2, valor: 7});
    baraja.push({palo: 2, valor: 3});
    baraja.push({palo: 1, valor: 3});
    //Triunfo 4 jugadores y siguientes cartas
    baraja.push({palo: 0, valor: 0});
    baraja.push({palo: 1, valor: 8});
    baraja.push({palo: 3, valor: 2});
    baraja.push({palo: 3, valor: 0});
    baraja.push({palo: 2, valor: 1});
    baraja.push({palo: 1, valor: 5});
    baraja.push({palo: 0, valor: 5});
    baraja.push({palo: 0, valor: 1});
    baraja.push({palo: 3, valor: 6});
    baraja.push({palo: 2, valor: 9});
    baraja.push({palo: 0, valor: 2});
    baraja.push({palo: 1, valor: 1});
    baraja.push({palo: 0, valor: 4});
    baraja.push({palo: 3, valor: 5});
    baraja.push({palo: 3, valor: 4});
    baraja.push({palo: 2, valor: 6});
    return baraja;
}

// Crear baraja
function crearBaraja() {
    const baraja = [];
    for (let iPalo = 0; iPalo < PALOS.length; iPalo++) {
        for (let iValor = 0; iValor < VALORES.length; iValor++) {
            baraja.push({ palo: iPalo, valor: iValor });
        }
    }
    return baraja;
}

// Mezclar baraja
function mezclarBaraja(baraja) {
    for (let i = baraja.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
    }
    return baraja;
}

function barajaToString(baraja) {
    let barajaString = baraja.map(carta => `${carta.valor},${carta.palo}`).join(";");
    return barajaString;
}

// Repartir cartas iniciales
function repartirCartas(baraja, numJugadores) {
    const manos = Array(numJugadores).fill().map(() => []);
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < numJugadores; j++) {
            manos[j].push(baraja.pop());
        }
    }
    return {
        manos,
        triunfo: baraja.pop(),
        mazo: baraja
    };
}

// Validar jugada
function validarJugada(carta, mano, mesa, triunfo, esPrimera) {
    if (!mano.some(c => c.palo === carta.palo && c.valor === carta.valor)) {
        return false; // La carta no está en la mano
    }

    if (esPrimera) return true; // Si es la primera carta, cualquiera es válida

    const cartaMesa = mesa[0];
    const tieneDelPalo = mano.some(c => c.palo === cartaMesa.palo);

    if (tieneDelPalo && carta.palo !== cartaMesa.palo) {
        return false; // Debe jugar del mismo palo si tiene
    }

    return true;
}

// Calcular ganador de la baza
function calcularGanadorBaza(mesa, triunfo) {
    let cartaGanadora = mesa[0];
    let indiceGanador = 0;

    for (let i = 1; i < mesa.length; i++) {
        const carta = mesa[i];
        if (carta.palo === triunfo.palo && cartaGanadora.palo !== triunfo.palo) {
            cartaGanadora = carta;
            indiceGanador = i;
        } else if (carta.palo === cartaGanadora.palo && 
                  VALORES.indexOf(carta.valor) < VALORES.indexOf(cartaGanadora.valor)) {
            cartaGanadora = carta;
            indiceGanador = i;
        }
    }

    return indiceGanador;
}

// Calcular puntos de la baza
function calcularPuntosBaza(cartas) {
    return cartas.reduce((total, carta) => total + PUNTOS[carta.valor], 0);
}

// Verificar cante
function verificarCante(mano, triunfo) {
    const cantes = [];
    for (const palo of PALOS) {
        const tieneRey = mano.some(c => c.palo === palo && c.valor === 'rey');
        const tieneCaballo = mano.some(c => c.palo === palo && c.valor === 'caballo');
        if (tieneRey && tieneCaballo) {
            const puntos = palo === triunfo.palo ? 40 : 20;
            cantes.push({ palo, puntos });
        }
    }
    return cantes;
}

module.exports = {
    crearBaraja,
    mezclarBaraja,
    barajaToString,
    barajaTest,
    repartirCartas,
    validarJugada,
    calcularGanadorBaza,
    calcularPuntosBaza,
    verificarCante,
    PUNTOS
}; 