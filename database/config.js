const moongose = require('mongoose');


const dbConnection = async() => {
    try {
        await moongose.connect(process.env.DB_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
        });
        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la Base de Datos, ver logs');
    }
    

}

module.exports = {
    dbConnection
}