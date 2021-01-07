const { response } = require("express");
const jwt = require('jsonwebtoken');


const validarJWT = ( req, res=response, next ) => {

    // Leer el Token que viene en el header de la peticion
    const token = req.header('x-token');

    // console.log solo para ver prueba de funcionamiento
    //console.log(token); 

    // Aca tengo que verificar si el token es correcto
    // Primero si viene token en el header
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en peticion'
        });
    }

    // Si viene Token valido si es el correcto

    try {
        //Voy a comparar el uid -que grabe originalmente en mi JWT
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        // Si hace ok, el verify da true sigue abajo, sino el error lo atrapa el catch

        // hago prueda con el consolelog  
        //console.log(uid);

        //luego del midleware voy a tener datos en getusuario para ello puedo asignar
        //el uid verificado por el token, para ello hago

        req.uid = uid;
        //llamo next -> quiere decir que pase el validador del JWT
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token Incorrecto'
        });
        
    }
}

module.exports = {
    validarJWT
}