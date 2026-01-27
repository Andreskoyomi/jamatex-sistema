const Tela = require ('../models/telaModel');

//Objeto que contendrá todas nuestras funciones de control
const telaController = {

    // Listar todas las telas usando el Modelo
    listarTodas: async (req, res) => {
        try {
            // Llamamos al método estático del modelo que ya creamos
            const resultados = await Tela.obtenerTodas(); 
            res.json(resultados);
        } catch (error) {
            console.error(error); // Útil para debugear
            res.status(500).json({ error: 'Error al listar el inventario' });
        }
    },
    // Crear una nueva tela
    crearTela: async (req, res) => {
        try {
            const datosTela = req.body;
            await Tela.crear(datosTela);

            res.json({ mensaje: 'Tela registrada con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar la tela' });
        }
    },
    //Consultar tela por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const tela = await Tela.obtenerPorId(id);

            if (!tela) {
                return res.status(404).json({ mensaje: 'Tela no encontrada' });
            }

            res.json(tela);
        } catch (error) {
            res.status(500).json({ error: 'Error al consultar la tela' });
        }
    },
    // Actualizar tela
    actualizarTela: async (req, res) => {
        try {
            const { id } = req.params;
            const datosTela = req.body;

            await Tela.actualizar(id, datosTela);
            res.json({ mensaje: 'Tela actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la tela' });
        }
    },
    // Eliminar tela
    eliminarTela: async (req, res) => {
        try {
            const { id } = req.params;
            await Tela.eliminar(id);

            res.json({ mensaje: 'Tela eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la tela' });
        }
    },
    // Búsqueda avanzada de telas
    buscarAvanzado: async (req, res) => {
        try {
            const filtros = req.query;

            if (Object.keys(filtros).length === 0) {
                return res.status(400).json({ mensaje: 'Debe enviar al menos un filtro de búsqueda' });
            }

            const resultados = await Tela.buscarAvanzado(filtros);
            res.json(resultados);

        } catch (error) {
            res.status(500).json({ error: 'Error en la búsqueda avanzada' });
        }
    }

};

module.exports = telaController;