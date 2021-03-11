const express = require('express');

// voy a utilizar el paquete instalado dotenv
require('dotenv').config();

// voy a configurar cors para luego hacer nuestros midlewares personalizados
const cors = require('cors')

const { dbConnection } = require('./database/config');

//Crear el Servidor Express
const app = express();

// voy a utilizar la conexion desde path database/config.js y para ello como lo exporte debo desestructurarlo aqui
app.use(cors());

//Lectura y parseo Body
app.use( express.json() );

// voy a llamar a la conexion de la BASE
dbConnection();

console.log( process.env );

//mongoDBAtlas:  willhook2003@gmail.com 645388gwr
// uHWHnUdpJYO5V8ee
// user: mean_user    (datos de MongoAtlas)

//mongodb+srv://mean_user:*****@cluster0.3dlct.mongodb.net/test?authSource=admin&replicaSet=atlas-k3y2sq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true

// Rutas para enlazar Router con el controlador
// voy a usar un midleware
app.use( '/api/usuarios', require('./routes/usuarios'));


// creo una nueva ruta para el login
app.use( '/api/login', require('./routes/auth'));

// Seccion 11 Creo ruta para hospitales
app.use( '/api/hospitales', require('./routes/hospitales'));
// Creo rutas para medicos
app.use( '/api/medicos', require('./routes/medicos'));

// Creo una ruta para las busquedas
app.use( '/api/todo', require('./routes/busquedas'));

// Creo una ruta (url) para la subida de archivos
app.use( '/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
});

