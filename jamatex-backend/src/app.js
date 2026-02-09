const express = require("express");
const cors = require("cors"); //  Importamos la librería
const db = require('./database/db');
const authRoutes = require('./routes/authRoutes');


// 1. Importar las rutas 
const usuarioRoutes = require('./routes/usuarioRoutes');
const telaRoutes = require('./routes/telaRoutes');

const app = express();
const PORT = 3000;

//2. Middleware permite que el servidor lea JSON
app.use(cors()); // 3. Habilitamos CORS (Importante que esté arriba)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Ruta madre
app.get("/", (req, res) => {
    res.send("API Jamatex funcionando correctamente");
});

//Conectar las rutas de usuarios
app.use('/usuarios', usuarioRoutes);
app.use('/telas', telaRoutes);
app.use('/auth', authRoutes);


//Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Prueba de conexión rápida
db.query('SELECT 1 + 1 AS result')
    .then(() => {
        console.log('✅ Conexión exitosa a la base de datos Jamatex');
    })
    .catch(err => {
        console.error('❌ Error conectando a la base de datos:', err.message);
    });