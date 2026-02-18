const Usuario = require ('../models/usuarioModel');
const bcrypt = require ('bcrypt');

//Objeto que contendrá todas nuestras funciones de control
const usuarioController = {

    //Función para obetener todos los usuarios
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.json(usuarios); //Emviamos los usuarios en formato JSON
        } catch (error) {
            res.status(500).json({error: 'Error al obtener usuarios'})
        }
    },

    //Función para crear usuario
        crearUsuario: async (req, res) => {
        try {
            const datos = req.body; 

            // --- ESTA ES LA LÍNEA CLAVE ---
            // Como tu tabla no acepta NULL en 'estado', se lo asignamos aquí.
            // 1 significa 'Activo'.
            datos.estado = 1; 

            const saltRounds = 10;
            // Asegúrate que 'contrasena' coincida con el nombre que pusiste en Android
            datos.contrasena = await bcrypt.hash(datos.contrasena, saltRounds);
            
            const resultado = await Usuario.crear(datos);
            res.status(201).json({ mensaje: 'Usuario creado con éxito' });
        } catch (error) {
            console.error("Error detallado:", error); 
            res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
    },

    // Función para consultar usuario por ID
    obtenerUsuarioPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar usuario' });
        }
    },

    //Función para actualizar usuario
    actualizarUsuario: async (req, res) => {
    try {
        const { id } = req.params; 
        const datos = req.body;

        // Agregamos este console.log para ver qué está llegando desde el celular
        console.log("Datos recibidos para actualizar:", datos);

        await Usuario.actualizar(id, datos);
        res.json({ mensaje: 'Usuario actualizado correctamente'});    
    } catch (error) {
        // MUY IMPORTANTE: Imprime el error real en la consola de Node para saber qué falló
        console.error("Error detallado:", error); 
        res.status(500).json({ error: 'Error al actualizar el usuario', detalle: error.message });
    }
},

    //Funcion para eliminar usuario
    eliminarUsuario: async (req, res) => {
        try {
            const { id } = req.params;
            await Usuario.eliminar(id);
            res.json({ mesnaje: 'Usuario eliminado correctamente'});
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar usuario'});
        }
    }
};

module.exports = usuarioController;