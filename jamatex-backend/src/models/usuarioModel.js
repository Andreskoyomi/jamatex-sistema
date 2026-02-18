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

// Método para actualizar un usuario existente (Flexible)
    static async actualizar(id, datos) {
        try {
            // Buscamos qué campos vienen en el objeto 'datos'
            const campos = Object.keys(datos); // Ejemplo: ['estado']
            const valores = Object.values(datos); // Ejemplo: [0]

            // Creamos la parte del SET dinámicamente: "nombre = ?, correo = ?"
            const setQuery = campos.map(campo => `${campo} = ?`).join(', ');

            const query = `UPDATE usuario SET ${setQuery} WHERE id_usuario = ?`;
            
            // Agregamos el ID al final del arreglo de valores
            const [resultado] = await db.query(query, [...valores, id]);
            
            return resultado;
        } catch (error) {
            throw error;
        }
    }

// Método para "eliminar" (Borrado Lógico)
    static async eliminar(id) {
        try {
            // En lugar de DELETE, hacemos un UPDATE
            const query = 'UPDATE usuario SET estado = 0 WHERE id_usuario = ?';
            const [resultado] = await db.query(query, [id]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;

