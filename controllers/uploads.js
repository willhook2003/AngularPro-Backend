// importo de NOde PATH para el manejo de los path de imagenes (sirve para construir un path completo)

const path = require('path'); 
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileupload = (req, res = response ) => {

    // voy a validar lo que me estan enviando para eso creo variables tipo y id que viene como parametro

    const tipo = req.params.tipo;
    const id   = req.params.id;

    //Valido los tipos validos que iran a cada directorio de la carpeta uploads del servidor
    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if ( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'no es un medico | usuario | hospital'
        });
    }

    // Ayudados con la doc de express-fileupload validamos que exista un archivo en la peticion 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay Archivo Seleccionado'
        });
    }
                                                  
    // Procesar la Imagen...

    const file = req.files.imagen;

    // files.imagen (imagen es el nombre propiedad que estoy mandando por el put)
    //hacemos un console.log de prueba para ver si nos esta enviado el archivo
    /*
    console.log(file);
    */
   
    // Extraer la extension del Archivo
    const nombreCortado = file.name.split('.');

    // nombreCortado es un arreglo de elementos, donde cada elemento serea parte del nombre hasta un punto
    // ejmplo si el nombre es usuarioOscar.1.foto.3.jpg
    // voy a tener un arreglo  [usuarioOscar 1 foto 3 jpg]
    // y voy a recorrer ese arreglo y sacar ultimo elemento, que sera la extension
    // lo hago de esta manera, creo variable ExtArchivo y le asigno el ultimo elemento del arreglo 
    // nombreCortado apoyado de .lenght-1

    const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];
    
    //Valido la extensión obtenida dentro de las que yo quiero permitir

    const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];

    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok:false,
            msg: 'No es una extension valida'
        });
    }

    // Ahora Generamos el nombre del Archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;


    // Crear PATH donde voy a guardar la imagen

    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // como ya tengo el path, voy a mover la imagen (no ayudamos de express-fileupload)

    // Use the mv() method to place the file somewhere on your server
    file.mv( path , (err) => {
    if (err){
        console.log(err)
        return res.status(500).json({
          ok: false,
          msg: 'Error al mover la imagen'
      });
    }   

    // ACTUALIZAR IMAGEN EN LA BASE DE DATOS (ASOCIARLO EN LA BASE)
     
    actualizarImagen( tipo, id, nombreArchivo );
    
    res.json({
        ok: true,
        msg: 'archivo subido',
        nombreArchivo
    });

    });

    



    
}

const retornoImagen= ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );


    // Imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        // para que lo que se envíe no sea un json sino un archivo utilizo .sendfile

    res.sendFile( pathImg );

    } else {
        const pathImg = path.join( __dirname, `../uploads/no-image.png` );
        res.sendFile( pathImg );
    }
    
    

}

module.exports = {
    fileupload,
    retornoImagen
}