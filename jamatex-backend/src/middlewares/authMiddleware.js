const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwtConfig'); // IMPORTANTE: no usar llaves, la exportación es directa

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verificamos que exista el header
    if (!authHeader) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

    // El header debe tener formato "Bearer TOKEN"
    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ mensaje: 'Formato de token inválido' });
    }

    const token = partes[1];

    try {
        // Verificamos y decodificamos el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // Guardamos info del usuario para los controladores
        next(); // Pasamos al siguiente middleware / controlador
    } catch (error) {
        // JWT inválido o expirado
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

module.exports = { verificarToken };




