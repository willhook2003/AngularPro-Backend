/*
    Hospitales
    ruta:   /api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');
// voy a importar mi MIDDLEWARES para poder usarlo en la ruta del post
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//Importar mis controladores para usarlos en la ruta
const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}  = require('../controllers/hospitales');


const router = Router();

router.get( '/', getHospitales );
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del Hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital
);

router.put( '/:id', 
    [], 
    actualizarHospital    
);

router.delete( '/:id', 
    borrarHospital
);

module.exports = router;
