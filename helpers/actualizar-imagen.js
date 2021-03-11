
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {

            
            // Tuve errores, no me borraba entonces pruebo en consola la funcion para saber si entra "true"
            // console.log(fs.existsSync( pathViejo ));
            //console.log( pathViejo );

           if ( fs.existsSync( path )) {
               //Borrar la imagen anterior
               fs.unlinkSync( path );
           }

}

const actualizarImagen = async( tipo, id, nombreArchivo ) => {

   //console.log('vamos bien!!');
    let pathViejo = '';
   switch ( tipo ) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);
           if ( !usuario ) {
               console.log('No es un usuario por Id');
               return false;
           } 

           pathViejo = `./uploads/usuarios/${ usuario.img }`;
           borrarImagen( pathViejo );

           usuario.img = nombreArchivo;
           await usuario.save();
           return true;

        break;
        case 'medicos':
           const medico = await Medico.findById(id);
           if ( !medico ) {
               console.log('No es un medico por Id');
               return false;
           } 

           pathViejo = `./uploads/medicos/${ medico.img }`;
           borrarImagen( pathViejo );

           medico.img = nombreArchivo;
           await medico.save();
           return true;

        break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if ( !hospital ) {
                console.log('No es un hospital por Id');
                return false;
            } 
 
            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejo );
 
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        break;
                
   }


}

module.exports = {
    actualizarImagen
}