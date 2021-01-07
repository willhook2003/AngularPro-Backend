/* Ruta
    api/usuarios/
*/
const { Router } = require('express');
const { check } = require('express-validator');

// voy a importar mi MIDDLEWARES para poder usarlo en la ruta del post
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear ruta de entrada para los request y response luego lo separamos en ruta y controlador
//aca estamos en la ruta y con getUsuarios llamamos al controlles 
router.get( '/', validarJWT, getUsuarios);

// enviar datos usuario a crear
//modo simple sin hacer validaciones de que se envien campos u nulos
/*
router.post( '/', crearUsuario);

esto lo vamos a implementa utilizando midleware en conjunto con express-validator
para saber si lo que me envia en el post es lo que estoy esperando

midleware : son funciones que se ejecutan antes de llegar a otras

@para implementar un unico midleware se envia como segundo argumento (3ero controlador)

router.post( '/', miUnicoMidleware, micontrolador); ejemplo de midleware unico

si es vario, debo enviar en segunda posicion como si fuera un array

voy a implementar uno o varios midleware con check que importo requie de "express-validator"
express validator debo instalarlo al paquete  npm install express-validator
*/

router.post( '/',
    [
        /* puedo implementar el check('nombre').not().isEmpty(), pero le puedo pasar un segundo argumento al check
        para poner un mensaje personalizado, entonces cuando hago la validacion en el controlador
        envío json al programador con el msg personalizado del check
        */
        check('nombre','el nombre es obligatorio').not().isEmpty(),
        check('password','la contraseña es obligatoria').not().isEmpty(),
        check('email','email es invalido').isEmail(),

        /* aca la idea es que si atrape errores no debo llamar al crearUsuario ya que va a ser inutil,
        tengo q volver a pedir correcion de campos par aque si se envie algo valido al controlador
    AHI ENTRA EN JUEGO MI MIDDLEWARE PERSONALIZADO  validar-campos
    */   
        validarCampos
    ],
    crearUsuario
);

//Creo una ruta para actualizar usuario, tanbien con sus validaciones igual que el post
router.put( '/:id', [
        //valido JWT
        validarJWT,
        check('nombre','el nombre es obligatorio').not().isEmpty(),
        check('email','email es invalido').isEmail(),
        check('role','el role es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizarUsuario
);

//Creo una ruta para borrar usuario, tanbien con sus validaciones igual que el post
router.delete( '/:id', 
    validarJWT,
    borrarUsuario
);

module.exports = router;