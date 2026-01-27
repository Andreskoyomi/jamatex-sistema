import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [telas, setTelas] = useState([]);

  // Función para traer las telas desde el backend
  const fetchTelas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/telas');
      setTelas(response.data);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  useEffect(() => {
    fetchTelas();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Jamatex - Inventario de Telas</h1>
      <button onClick={fetchTelas} style={{ marginBottom: '20px' }}>
        Actualizar Inventario
      </button>
      
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Código</th>
            <th>Material</th>
            <th>Color</th>
            <th>Metros</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {telas.length > 0 ? (
            telas.map((tela) => (
              <tr key={tela.id_tela}>
                <td>{tela.codigo}</td>
                <td>{tela.material}</td>
                <td>{tela.color}</td>
                <td>{tela.metros_disponibles}</td>
                <td>{tela.ubicacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay datos en el inventario</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
