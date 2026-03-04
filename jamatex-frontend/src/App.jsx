import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'; 
import Header from './components/Header';
import ModuloTelas from './components/ModuloTelas';
import ModuloUsuarios from './components/ModuloUsuarios';
import Login from './components/Login'; // Importamos el nuevo Login
import RutaProtegida from './components/RutaProtegida';

function App() {
  const [moduloActual, setModuloActual] = useState('inventario');

  // Este componente envuelve tu diseño actual para cuando el usuario YA entró
  const Dashboard = () => (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar setModuloActual={setModuloActual} moduloActual={moduloActual} />
      <main className="flex-1 ml-64 flex flex-col">
        <Header />
        <div className="p-10">
          {moduloActual === 'inventario' ? <ModuloTelas /> : <ModuloUsuarios />}
        </div>
      </main>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* RUTA 1: Login (Pantalla limpia, sin Sidebar ni Header) */}
        <Route path="/" element={<Login />} />

        {/* RUTA 2: El sistema principal (Solo accesible si hay sesión) */}
        <Route 
  path="/dashboard" 
  element={
    <RutaProtegida>
      <Dashboard />
    </RutaProtegida>
  } 
/>

        {/* Redirección por si escriben cualquier cosa */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;