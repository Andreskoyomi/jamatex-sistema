const db = require('../database/db'); // traemos la conexión

class Usuario {
    //Método para obtener todos los usuarios
    static async obtenerTodos() {
        try {
            const [filas] = await db.query('SELECT * FROM usuario');
            return filas;
        } catch (error) {
            throw error;
        }
  } 
// Método para crear un nuevo usuario
    static async crear(datosUsuario) {
        try {
            // Desestructuramos los datos que vienen del formulario/cliente
            const { nombre, correo, contrasena, rol, estado } = datosUsuario;
            
            const query = `
                INSERT INTO usuario (nombre, correo, contrasena, rol, estado) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            // Enviamos los datos en un arreglo para que el driver los limpie y asegure
            const [resultado] = await db.query(query, [nombre, correo, contrasena, rol, estado]);
            
            return resultado; // Esto nos dirá el ID del usuario creado
        } catch (error) {
            throw error;
        }
    }
// Método para obtener un usuario por ID
    static async obtenerPorId(id) {
        try {
            const query = 'SELECT * FROM usuario WHERE id_usuario = ?';
            const [filas] = await db.query(query, [id]);
            return filas[0]; // un solo usuario
        } catch (error) {
            throw error;
        }
    }
// Método para obtener usuario por correo (para loghin)
    static async obtenerPorCorreo(correo) {
        try {
            const query = 'SELECT * FROM usuario WHERE correo = ?';
            const [filas] = await db.query(query, [correo]);
            return filas[0];
        } catch (error) {
            throw error;
        
        }
    }

// Método para actualizar un usuario existente
    static async actualizar(id, datosActualizados) {
        try {
            const { nombre, correo, contrasena, rol, estado } = datosActualizados;
            const query = `
                UPDATE usuario 
                SET nombre = ?, correo = ?, contrasena = ?, rol = ?, estado = ? 
                WHERE id_usuario = ?
            `;
            // El ID va al final porque es el último "?" en la consulta SQL
            const [resultado] = await db.query(query, [nombre, correo, contrasena, rol, estado, id]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

// Método para eliminar un usuario
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM usuario WHERE id_usuario = ?';
            const [resultado] = await db.query(query, [id]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;

