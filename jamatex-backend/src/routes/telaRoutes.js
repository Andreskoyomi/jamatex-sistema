const express = require('express');
const router = express.Router();

const telaController = require('../controllers/telaController');

router.get('/', telaController.listarTodas); // Para cargar la tabla al inicio
router.get('/buscar/avanzado', telaController.buscarAvanzado); // Ejemplo: /telas/buscar/avanzado?material=Lino
router.get('/:id', telaController.obtenerPorId);
router.post('/', telaController.crearTela);
router.put('/:id', telaController.actualizarTela);
router.delete('/:id', telaController.eliminarTela);
module.exports = router;