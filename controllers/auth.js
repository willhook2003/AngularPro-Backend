const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { validarCampos } = require("../middlewares/validar-campos");
const { generarJWT } = require("../helpers/jwt");

const login = async( req, res = response) => {

    const {email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });
        
        // Verificar email
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'email o contraseña es inválido -email'
            });
        }

        //Verificar Contraseña

        // como tengo una contraseña encriptada por bcript y tengo la que el usuairo ingreso(sin encriptar),
        //hago lo siguiente
        // uso la funcion del bcript llamada compareSync
        // Sintaxis es: .compareSync ( contraseñaIngresada por Usuario  , ContraseñaEncriptada hash de la BD )
        // Aclara que, no es que lo encripta de nuevo lo q ingresa usuario sino que simplemente
        // lo compara (hace un macht) devuelve booleano
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'email o contraseña no válidos -contraseña-'
            });
        }
        
        //GENERAR TOKEN
        const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
           // msg: 'Hola Mundo esta andando'
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin'
        })
    }

}

module.exports = {
    login
}