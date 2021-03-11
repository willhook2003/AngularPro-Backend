/*
    Hospitales
    ruta:   /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');
// voy a importar mi MIDDLEWARES para poder usarlo en la ruta del post
const { validarCampos } = require('../middlewares/validar-campos');

//Importar mis controladores para usarlos en la ruta
const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico    
}  = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', getMedicos );
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del Medico es necesario').not().isEmpty(),
        check('hospital','El id del hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put( '/:id', 
    [], 
    actualizarMedico  
);

router.delete( '/:id', 
    borrarMedico
);

module.exports = router;
