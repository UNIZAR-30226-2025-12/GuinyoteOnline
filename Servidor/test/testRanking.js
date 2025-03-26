const axios = require('axios');

const url = 'https://guinyoteonline-hkio.onrender.com/rankings';

async function test() {
    //-------------------------------------------------------------//
    await axios.get(url)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
}

 test();