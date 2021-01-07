

/* ESTE ES UN MIDDLEWARES PERSONALIZADO

***Es muy similar a un controlador, o sea voy a tener mi request, mi response, y un parametro adicional ()argumento

*/
// importo response desde express
const { response } = require('express');
//tambien importo validationREsult para verificar los errores atrapados en el check post
const { validationResult } = require('express-validator');

const  validarCampos = (req, res = response, next) => {

    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    // si llegó a este punto quiere decir que no hubo errores entonces recuen ahi llamo a mi argumento next

    next();
}

// exporto mi validarCampos para que lo pueda utilizar en las rutas ejemplo: ..routes/usuarios
module.exports = {
    validarCampos
}