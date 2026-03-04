// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  
  // Recuperamos los datos del usuario que guardamos en el Login
  // Usamos JSON.parse porque lo guardamos como texto y queremos volverlo un objeto
  const datosUsuario = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario', rol: 'Invitado' };

  // Función para cerrar sesión
  const manejarLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.clear(); // Borra el token y los datos del usuario
      navigate('/');        // Nos manda de vuelta al Login
    }
  };

  // Función para obtener iniciales del nombre
  const obtenerIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="bg-white h-20 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
      <h2 className="text-[#2c3e50] font-black text-xs uppercase tracking-[0.2em]">
        Sistema de gestión de inventarios Jamatex
      </h2>
      
      <div className="flex items-center gap-6">
        {/* Información del Usuario Dinámica */}
        <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
            {datosUsuario.nombre} <br/> 
            <span className="text-emerald-500 italic">● En línea</span>
          </span>
          <div className="w-10 h-10 bg-[#2c3e50] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
            {obtenerIniciales(datosUsuario.nombre)}
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button 
          onClick={manejarLogout}
          className="group flex flex-col items-center justify-center gap-1 transition-all"
          title="Cerrar Sesión"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
          <span className="text-[8px] font-black text-slate-400 group-hover:text-red-500 uppercase tracking-tighter">Salir</span>
        </button>
      </div>
    </header>
  );
}