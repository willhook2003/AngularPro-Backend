const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

// Sobreescribir metodo para que el retorno a la consulta solo me envie los campos que necesito
// por lo que por ejemplo 
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...Object} = this.toObject();
    Object.uid = _id;
    return Object;
})
module.exports = model('Usuario', UsuarioSchema );
