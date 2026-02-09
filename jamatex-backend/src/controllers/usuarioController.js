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
            const datos = req.body; // Aquí llega lo que el usuario envió
            //Hashear la contraseña
            const saltRounds = 10;
            datos.contrasena = await bcrypt.hash(datos.contrasena, saltRounds);
            const resultado = await Usuario.crear(datos);
            res.status(201).json({
                mensaje: 'Usuario creado con éxito' ,
                id: resultado.insertId
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear usuario' });
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
    actualizarUsuario: async (req, res)=> {
        try {
            const { id } = req.params; //Capturamos el ID de la URL
            const datos = req.body;
            await Usuario.actualizar(id, datos)
            res.json({ mensaje: 'Usuario actualizado correctamente'});    
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el usuario'});
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