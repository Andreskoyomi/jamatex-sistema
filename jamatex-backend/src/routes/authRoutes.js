// Importación del framework Express para la gestión de rutas
const express = require('express');

// Inicialización del enrutador de Express
const router = express.Router();

// Importación del controlador de autenticación que gestiona la lógica de acceso
const { login } = require('../controllers/authController');

/**
 * Definición de ruta para inicio de sesión
 * Método: POST
 * Endpoint: /auth/login (o la ruta base definida en la app)
 */
router.post('/login', login);

// Exportación del módulo para su integración en el servidor principal
module.exports = router;
