const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');



// 1. Ruta para obtener todos los usuarios (R del CRUD)
router.get('/', usuarioController.listarUsuarios);

// 2. Ruta para crear un usuario (C del CRUD)(Solo un administrador puede crear usuarios)
router.post('/', verificarToken, verificarRol(['admin']), usuarioController.crearUsuario);

 //router.post('/', usuarioController.crearUsuario);

// 3. Ruta para actualizar un usuario por su ID (U del CRUD) (Solo un administrador puede actualizar usuarios)
router.put('/:id', verificarToken, verificarRol(['admin']), usuarioController.actualizarUsuario);

//4. Ruta para eliminar un usaurio por su ID (D del CRUD) (Solo un administrador puede eliminar usuarios)
router.delete('/:id', verificarToken, verificarRol (['admin']), usuarioController.eliminarUsuario);

//5. Consultar usuario por ID
router.get('/:id', verificarToken, usuarioController.obtenerUsuarioPorId);

module.exports = router;