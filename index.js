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

// voy a llamar a la conexion de la BASE
dbConnection();

console.log( process.env );

// pass: Dd3vfiXfOfYZo0Qd
// user: mean_user    (datos de MongoAtlas)

//mongodb+srv://mean_user:*****@cluster0.3dlct.mongodb.net/test?authSource=admin&replicaSet=atlas-k3y2sq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true


// crear ruta de entrada para los request y response
app.get( '/', (request, response) => {
    response.json({
        ok: true,
        msg: "hola mundo"
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
});

