/*
    Uploads - Subir Archivos
    ruta:   /api/upload
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { fileupload, retornoImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// uso la libreria express-fileupload antes del put
router.use(expressFileUpload());

// Busqueda en todas las tablas de manera simultanea
router.put( '/:tipo/:id', validarJWT ,fileupload );

// Ruta para obtener las imagenes desde mi servidor
router.get( '/:tipo/:foto', retornoImagen );


module.exports = router;