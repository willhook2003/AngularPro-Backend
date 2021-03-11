const { response } = require("express");

const Hospital = require('../models/hospital')

const getHospitales = async(req, res = response) => {
        
    //gracias a mongoose puedo obtener la lista de todos los hospitales
    // de manera muy sencila usando find()  - Asi devuelvo todos, despues puedo dentro del find({condiciones})

    //const hospitales = await Hospital.find();

    // Ahora Usamos GET POPULATE, para que en la peticion nos devuelva los campos de las refenrecia de los 
    //objetos que se ennvia por mongo 

    const hospitales = await Hospital.find()
                                .populate('usuario','nombre email img')

    res.json({
        ok: true,
        msg: hospitales
    })
}

const crearHospital = async(req, res = response) => {

        const uid = req.uid;
        const hospital = new Hospital({ 
            usuario: uid,
            ...req.body 
        });
        
        try {

            const hospitalDB =  await hospital.save();

            res.json({
            ok: true,
            //msg: 'crearHospital'
            hospital: hospitalDB
        })
        } catch(error) {
            res.status(500).json({
                ok: false,
                msg: 'Error Inesperado Hable con Administrador'
            })
        }
    
}
const actualizarHospital = (req, res = response) => {
        res.json({
        ok: true,
        msg: 'actualizarHospitales'
    })
}
const borrarHospital = (req, res = response) => {
        res.json({
        ok: true,
        msg: 'borrarHospitales'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}