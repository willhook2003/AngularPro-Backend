const jwt = require('jsonwebtoken');
const { Promise } = require('mongoose');

const generarJWT = ( uid ) => {

    //transformamos jwt en promesa

    return new Promise( ( resolve, reject ) => {

            // crear payload para el JWT
        // tener en cuenta que en el payload puedo grabar lo que quiera
        // pero hay que tener cuidado de tener informacion sensible por ejemplo
        // claves, contraseñas, usuario etc
        const payload = {
            uid
        };


        // JWT utiliza callback pero necesito que trabaje como un async *promesa (para ello utilizaremos un tips)
        // tener en cuenta .sign( primer payload, palabra secreta-que lo ovy a manejar como una variable
        // y sera como variable de entorno env -ver env palabra secreta)
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
        }); 

    });

}

module.exports = {
    generarJWT
}