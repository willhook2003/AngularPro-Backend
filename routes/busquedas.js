/*
    busquedas
    ruta:   /api/todo/
*/

const { Router } = require('express');
const { getTodo, getDocumentosColleccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Busqueda en todas las tablas de manera simultanea
router.get( '/:busqueda', validarJWT ,getTodo );

// Busqueda en una tabla especifica
router.get( '/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColleccion);

module.exports = router;