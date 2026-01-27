const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// 1. Ruta para obtener todos los usuarios (R del CRUD)
router.get('/', usuarioController.listarUsuarios);

// 2. Ruta para crear un usuario (C del CRUD)
router.post('/', usuarioController.crearUsuario);

// 3. Ruta para actualizar un usuario por su ID (U del CRUD)
router.put('/:id', usuarioController.actualizarUsuario);

//4. Ruta para eliminar un usaurio por su ID (D del CRUD)
router.delete('/:id', usuarioController.eliminarUsuario);

//5. Consultar usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

module.exports = router;