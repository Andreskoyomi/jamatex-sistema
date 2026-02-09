const verificarRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        // req.usuario viene del token
        if (!req.usuario || !req.usuario.rol) {
            return res.status(403).json({ mensaje: 'Rol no definido' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tiene permisos para esta acción' });
        }

        next();
    };
};

module.exports = { verificarRol };
