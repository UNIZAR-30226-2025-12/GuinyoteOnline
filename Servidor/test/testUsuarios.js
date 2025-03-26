const axios = require('axios');

const paramsInicio = {
  correo: 'nuevo@gmail.com',
  contrasena: 'nuevo12345'
};

const paramsRegistro = {
    nombre: 'nuevo',
    correo: 'nuevo@gmail.com',
    contrasena: 'nuevo12345'
};

const paramsAct = {
    nombre: 'nuevo2',
    foto_perfil: 'x.png'
}

const url = 'https://guinyoteonline-hkio.onrender.com/usuarios/';

async function test() {
    //-------------------------------------------------------------//
    await axios.post(url + "registro", paramsRegistro)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.get(url)
    .then((response) => {
        console.log('Usuarios tras la inserción:', JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.post(url + "inicioSesion", paramsInicio)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.put(url + "actualizacionPerfil/nuevo@gmail.com", paramsAct)
    .then((response) => {
        console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
    //-------------------------------------------------------------//
    await axios.get(url + "perfil/nuevo@gmail.com")
    .then((response) => {
        console.log('Usuario tras actualizacion:', response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud:', error);
    });
}

test();