const axios = require('axios');

const paramsSolicitud = {
  idUsuario: 'pedro.martinez@yahoo.com',
  idAmigo: 'laura.rodriguez@outlook.com'
};

const params = {
    idUsuario:'laura.rodriguez@outlook.com',
    idSolicitante: 'pedro.martinez@yahoo.com'
}

const url = 'https://guinyoteonline-hkio.onrender.com/amigos/';

async function test() {
    //-------------------------------------------------------------//
    await axios.post(url + "enviarSolicitud", paramsSolicitud)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.get(url + "pedro.martinez@yahoo.com")
    .then((response) => {
        console.log('Amigos de solicitante:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    await axios.get(url + "laura.rodriguez@outlook.com")
    .then((response) => {
        console.log('amigos de solicitado:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.post(url + "rechazarSolicitud", params)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.get(url + "pedro.martinez@yahoo.com")
    .then((response) => {
        console.log('Amigos de solicitante:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    await axios.get(url + "laura.rodriguez@outlook.com")
    .then((response) => {
        console.log('amigos de solicitado:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.post(url + "enviarSolicitud", paramsSolicitud)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.post(url + "aceptarSolicitud", params)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.get(url + "pedro.martinez@yahoo.com")
    .then((response) => {
        console.log('Amigos de solicitante:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    await axios.get(url + "laura.rodriguez@outlook.com")
    .then((response) => {
        console.log('amigos de solicitado:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
}

test();