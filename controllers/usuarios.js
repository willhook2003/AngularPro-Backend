const { response } = require('express');
// voy a importar validatorResult para atrapar todos "los errores" que me pudieron enviar por 
//el post y que pasaron los midlewares
/* ya no lo uso al crear mi middl  - modifique ultimo

const { validationResult, check } = require('express-validator');
*/

/* VOY a importar el bcript para tratar la encriptacion de mi password
*/
 
 const bcrypt = require('bcryptjs');
 
// Importo el modelo "Schema -usuarioSchema- de usuario" para crear un Usuario -objeto que servira para instanciarlo- es mayuscula 
// porque es un objeto/clase 
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    /* PAGINACION: una forma de hacerlo manualmente, pero lo optimizaremos con el promise.all desde ES6

    */
    const desde = Number(req.query.desde) || 0 ;
    
    /*
    console.log(desde);
    
    const usuarios = await Usuario
                                    .find({}, 'nombre email google role')
                                    .skip( desde )
                                    .limit( 5)
    
    const total = await Usuario.count();

    definiendo asi, con dos querys seguidos como consultas asincronas(await)
    estariamos esperando, que resuelva una y luego despues de esa volver a esperar a que se 
    resuelva la siguiente....
    Esto lo que harìa es una relentizacion de nuestras consultas(para continuar el programa) si tuvieramos
    muchos registros en la base por cada una de ellas

    PAra esto existe el Promise.all  -Que es un arreglo de promesas, que se deberan cumplir, teneniedo
    cada uno de los await como registros asiciativos por cada posicion del array


    implemento un arreglo de promesas  await Promesi.all
    y lo desestructuro como const [promesa1, promesa2, etc ..]
    */

    const [ usuarios, total ] = await Promise.all([
        Usuario
                .find({}, 'nombre email google role img')
                .skip( desde )
                .limit( 5 ),
        Usuario.count()
    ]);

     //como una promesa, deberemos espera a que termine la consulta de todos los usuario para emitirlo dentro del response
    // Para buscar todos los usuarios, sin ninguna filtro - trae todo los atributos del usuario objeto-
    /*Se usa entonces .find(); solo parentesis sin argumentos
        const usuarios = await Usuario.find();  */
    /*Para realizar consulta y especificar un filtro hare .find({}, 'nombre') con {} especifico que es un filtro
    y con 'atributo1 atributo2 atributo3' especifico qué atributo quiero traer
    
        const usuarios = await Usuario.find({}, 'nombre email google role');
    
        ****** esto se hizo antes de realizar PAGINACION, quedo comentario abajo
    */
        res.json({
        ok: true,
        usuarios,
        total,
        // esto configure en mi midlewarw de JWT y lo devuelvo por aca
        uid: req.uid
    });
}

const crearUsuario = async ( req , res = response) => {
    /* ver consola prieba 
    console.log(req.body);
    */
    const { email, password} = req.body;

    // ACA DEBERIAMOS HACER VALIDACION PREVIA
    // valido los errores que fuero capturados por el check del espress-validator
    //usando validationResult y obteniendo el arreglo de errores
    /* Lo implemento asi:

    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    AHORA como {este} es el controlador, y el mismo debo dejarlo limpio y debe ser un codigo unico

    voy a crearme con la validacion anterior un MIDLEWARE PERSONALIZACION

    => me servira eso, ya que estas validaciones las puedo reutilizar y evitare asi copiar y pegar en todos los lugares
    donde debo usar

    LLEVO TODO ESTE CODIGO DE VERIFICACION DE ARRAY ERRORES A UN MIDDLEWARES (como un controlador previo que despues me 
        enviara aqui
        --- dejo todo comentado a fin de entender nada mas 
    */


    // realizo validacion del email si ya esta cargado 
    try {

        existeEmail = await Usuario.findOne( { email } );
        
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "el correo electronico ya se encuentra registrado"
            });
        }


        const usuario = new Usuario( req.body );


        /* Antes de grabar mi usuario en BD voy a 
        ENCRIPTAR LA CONTRASEÑA 
        para esto uso un salt que me genera un dato aleatorio y se aplica un hash encriptador
        en una via para q sea imposible desencriptarla
        */

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


    // para grabar en la base de datos realizo, como save es una promesa no lo va a hacer de manera instantanea hasta que se termine de 
    // ejecutar la respuesta response - entonces debo usar el await con anysc para ser asincrono
    await usuario.save();

    //GENERAR TOKEN
    const token = await generarJWT( usuario.id );

    res.json({
        ok: true,
        usuario,
        token
    });

            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado... ver logs'
        });
        
        
    }
    
}

//Defino controlado para actualizar Usuario y exporto en module.exports

const actualizarUsuario = async (req, res=response) => {

    const uid = req.params.id;

    try {
        const usuarioDb = await Usuario.findById( uid );

        if ( !usuarioDb ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado en DB'
            });
        }

        const campos = req.body;
        if ( usuarioDb.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne( { email: req.body.email});
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'ya existe ese email en la BD'
                })
            }
        }

        // Actualizaciones

        delete campos.password;
        delete campos.google;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate ( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuarioActualizado
        })
    } catch (error) {
       console.log(error);
       res.status(500).json({
           ok: false,
           msg: 'error inesperado'
       }) 
    }



}


// Defino el metodo para borrar el usuario

const borrarUsuario = async(req, res=response) => {

    const uid = req.params.id;
    try {
        const usuarioDb = await Usuario.findById( uid );

        if ( !usuarioDb ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado en DB'
            });
        }

        //eliminacion Fisica de la BAse, normalmente lo que se usa es una marca, desabilitar y no eliminar fisicamente
        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: "usuario eliminado de la base"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });
        
    }
}
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}