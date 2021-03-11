const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital : {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
});

// Sobreescribir metodo para que el retorno a la consulta solo me envie los campos que necesito
// por lo que por ejemplo 
MedicoSchema.method('toJSON', function() {
    const { __v, ...Object} = this.toObject();
    return Object;
})
module.exports = model('Medico', MedicoSchema );
