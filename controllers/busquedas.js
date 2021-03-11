const { response } = require("express");

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;

    // Para reliazar una busqueda insensible, y no key sensitive ingresando .find ({ nombre: busqueda})
    // reemplazare el parametro busqueda por una expresion regular

    const regular_expresion = RegExp( busqueda, 'i' );

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regular_expresion }),
        Medico.find({ nombre: regular_expresion }),
        Hospital.find({ nombre: regular_expresion })
    ]);

    /* una consulta unitaria para buscar de usuario por nombre 
    const usuarios = await Usuario.find({ nombre: regular_expresion });

    */
    res.json({
        ok: true,
        //msg: "busqueda",
        //busqueda,
        usuarios,
        medicos,
        hospitales
    })

}

const getDocumentosColleccion = async(req, res=response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regular_expresion = RegExp( busqueda, 'i' );

    // Defino un arreglo vacio, por donde voy a devolver los resultados de la consulta
    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regular_expresion })
                                .populate('usuario', 'email');        
            break;
        case 'medicos':
            data = await Medico.find({ nombre: regular_expresion })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regular_expresion })
                                 .populate('usuario', 'nombre img');
            
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la colleccion deber ser usuario | medicos | hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data
    })
}



module.exports = {
    getTodo,
    getDocumentosColleccion
}