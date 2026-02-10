// Importación de la librería para manejo de JSON Web Tokens
const jwt = require('jsonwebtoken');
// Importación de la clave secreta para la validación de firmas de los tokens
const JWT_SECRET = require('../config/jwtConfig');

/**
 * Middleware para la validación de autenticación mediante JWT
 * Verifica la existencia y validez del token en las cabeceras de la petición
 */
const verificarToken = (req, res, next) => {
    // Extracción de la cabecera 'authorization' de la petición
    const authHeader = req.headers['authorization'];

    // Validación: Si no existe la cabecera, se deniega el acceso (403 Forbidden)
    if (!authHeader) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

    /**
     * El estándar Bearer requiere el formato: "Bearer [TOKEN]"
     * Se divide la cadena para separar el esquema del token real
     */
    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ mensaje: 'Formato de token inválido' });
    }

    const token = partes[1];

    try {
        // Validación de la firma del token y decodificación de su contenido
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Se adjunta la información decodificada al objeto req para uso en controladores posteriores
        req.usuario = decoded; 
        
        // Función next() permite que la petición continúe al siguiente proceso
        next(); 
    } catch (error) {
        // En caso de firma inválida o token expirado, se retorna error 401
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

// Exportación del middleware para ser utilizado en la protección de rutas privadas
module.exports = { verificarToken };




