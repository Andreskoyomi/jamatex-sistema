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

    // --- CORRECCIÓN AQUÍ: Quitamos el WHERE estado = 1 ---
    static async obtenerTodas() {
        try {
            // Ahora traemos TODO para que el Frontend (React) decida qué mostrar
            const [filas] = await db.query('SELECT * FROM tela');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    // Método para buscar una tela por su ID
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
            // Agregamos 'codigo' por si decides editarlo también desde el modal
            const { codigo, material, color, diseno, metros_disponibles, ancho, ubicacion, estado } = datosTela;
            const query = `
                UPDATE tela
                SET codigo = ?, material = ?, color = ?, diseno = ?, metros_disponibles = ?, ancho = ?, ubicacion = ?, estado = ?
                WHERE id_tela = ?
            `;
            const [resultado] = await db.query(query, [
                codigo, material, color, diseno, metros_disponibles, ancho, ubicacion, estado, id_tela
            ]);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar tela (Desactiva el registro)
    static async eliminar(id_tela) {
        try {
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