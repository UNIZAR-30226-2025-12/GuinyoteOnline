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

// Crear baraja
function crearBaraja() {
    const baraja = [];
    for (const palo of PALOS) {
        for (const valor of VALORES) {
            baraja.push({ palo, valor });
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
    repartirCartas,
    validarJugada,
    calcularGanadorBaza,
    calcularPuntosBaza,
    verificarCante,
    PUNTOS
}; 