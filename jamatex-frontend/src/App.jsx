import React, { useState } from 'react';
import Sidebar from './components/Sidebar'; // Conecta con tu archivo
import Header from './components/Header';
import ModuloTelas from './components/ModuloTelas';
import ModuloUsuarios from './components/ModuloUsuarios';

function App() {
  const [moduloActual, setModuloActual] = useState('inventario');

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* 1. Sidebar (Componente importado) */}
      <Sidebar setModuloActual={setModuloActual} moduloActual={moduloActual} />

      {/* 2. El margen izquierdo (ml-64) es el que evita que el contenido se encime */}
      <main className="flex-1 ml-64 flex flex-col">
        <Header />
        <div className="p-10">
          {moduloActual === 'inventario' ? <ModuloTelas /> : <ModuloUsuarios />}
        </div>
      </main>
    </div>
  );
}

export default App;