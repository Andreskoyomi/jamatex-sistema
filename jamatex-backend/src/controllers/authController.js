const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwtConfig');

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
        }

        const usuario = await Usuario.obtenerPorCorreo(correo);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        if (usuario.estado !== 1) {
            return res.status(403).json({ mensaje: 'Usuario inactivo' });
        }

        const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

         // Aquí se crea el token
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el login' });
    }

};

module.exports = { login };
