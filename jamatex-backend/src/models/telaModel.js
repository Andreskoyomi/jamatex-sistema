// Importamos la conexión a la base de datos
const db = require('../database/db');

class Tela {
    // Método para registrar una nueva tela
    static async crear(datosTela) {
        try {
            const { codigo, material, color, diseno, metros_disponibles, ancho, ubicacion, estado } = datosTela;

            const query = `
                INSERT INTO tela 
                (codigo, material, color, diseno, metros_disponibles, ancho, ubicacion, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [resultado] = await db.query(query, [
                codigo, material, color, diseno, metros_disponibles, ancho, ubicacion, estado || 1 // 1 por defecto si no viene
            ]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    // Método para obtener todas las telas (Necesario para la tabla inicial)
    static async obtenerTodas() {
        try {
            const [filas] = await db.query('SELECT * FROM tela WHERE estado = 1');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    // Método para buscar una tela por su ID (Para que coincida con obtenerPorId del controlador)
    static async obtenerPorId(id) {
        try {
            const [filas] = await db.query('SELECT * FROM tela WHERE id_tela = ?', [id]);
            return filas[0];
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar una tela existente
    static async actualizar(id_tela, datosTela) {
        try {
            const { material, color, diseno, metros_disponibles, ancho, ubicacion, estado } = datosTela;
            const query = `
                UPDATE tela
                SET material = ?, color = ?, diseno = ?, metros_disponibles = ?, ancho = ?, ubicacion = ?, estado = ?
                WHERE id_tela = ?
            `;
            const [resultado] = await db.query(query, [
                material, color, diseno, metros_disponibles, ancho, ubicacion, estado, id_tela
            ]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar tela (deja inactivo)
    static async eliminar(id_tela) {
        try {
            // Usamos 0 para representar INACTIVO según tipo de dato tinyint
            const query = 'UPDATE tela SET estado = 0 WHERE id_tela = ?';
            const [resultado] = await db.query(query, [id_tela]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    // Método para búsqueda avanzada
    static async buscarAvanzado(filtros) {
        try {
            let query = 'SELECT * FROM tela WHERE 1=1';
            let valores = [];
            const { material, color, diseno, estado } = filtros;

            if (material) { query += ' AND material LIKE ?'; valores.push(`%${material}%`); }
            if (color) { query += ' AND color = ?'; valores.push(color); }
            if (diseno) { query += ' AND diseno = ?'; valores.push(diseno); }
            if (estado) { query += ' AND estado = ?'; valores.push(estado); }

            const [filas] = await db.query(query, valores);
            return filas;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Tela;