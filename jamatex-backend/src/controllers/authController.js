// Importamos el modelo de Usuario para consultar la base de datos
const Usuario = require('../models/usuarioModel');
// Librería para comparar contraseñas de forma segura (sin conocer la original)
const bcrypt = require('bcrypt');
// Librería para generar los (Tokens)
const jwt = require('jsonwebtoken');
// La clave secreta para firmar los tokens (es como el sello oficial de la empresa)
const JWT_SECRET = require('../config/jwtConfig');

// Función principal para el inicio de sesión
const login = async (req, res) => {
    try {
        // Extraemos el correo y la clave que el usuario escribió en el formulario
        const { correo, contrasena } = req.body;

        // Validación básica: Si falta algún dato, no seguimos y avisamos al usuario
        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
        }

        // Buscamos en la base de datos si existe alguien con ese correo
        const usuario = await Usuario.obtenerPorCorreo(correo);

        // Si no se encuentra el usuario, devolvemos error (401 es No Autorizado)
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificamos el "Borrado Lógico": Si el estado no es 1, el usuario está desactivado
        if (usuario.estado !== 1) {
            return res.status(403).json({ mensaje: 'Usuario inactivo' });
        }

        // Comparamos la clave escrita con la clave cifrada guardada en la base de datos
        const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

        // Si la clave no coincide, devolvemos error
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // PROCESO DE CREACIÓN DEL TOKEN (El brazalete de acceso)
        // Guardamos dentro del token el ID y el ROL para saber qué permisos tiene después
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol }, // Datos que viajan ocultos en el token
            JWT_SECRET,                                   // Sello de seguridad
            { expiresIn: '8h' }                           // El token vencerá en 8 horas por seguridad
        );

        // Si todo salió bien, enviamos la respuesta positiva al frontend o a Postman
        res.json({
            mensaje: 'Login exitoso',
            token, // Aquí entregamos el código largo al usuario
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol // Enviamos el rol para que el frontend sepa qué botones mostrar
            }
        });

    } catch (error) {
        // Si algo falla en el servidor (ej. se cae la base de datos), avisamos del error
        res.status(500).json({ mensaje: 'Error en el login' });
    }
};

// Exportamos la función para que pueda ser usada en el archivo de rutas
module.exports = { login };
