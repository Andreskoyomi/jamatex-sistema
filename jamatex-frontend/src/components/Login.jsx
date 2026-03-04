import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para navegar sin recargar la página

const Login = () => {
  // 1. ESTADO PARA LAS CREDENCIALES
  const [credenciales, setCredenciales] = useState({
    correo: '',
    contrasena: ''
  });
  
  // 2. ESTADO PARA LOS MENSAJES DE ERROR
  const [error, setError] = useState('');
  
  // 3. INICIALIZAR EL NAVEGADOR
  const navigate = useNavigate();

  // 4. FUNCIÓN PARA ENVIAR LOS DATOS
  const manejarLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores anteriores

    try {
      // Petición a tu backend (Node.js en puerto 3000)
      const respuesta = await axios.post('http://localhost:3000/auth/login', credenciales);
      
      if (respuesta.data.token) {
        // Guardamos el token para usarlo en futuras peticiones
        localStorage.setItem('token', respuesta.data.token);
        
        // Guardamos los datos básicos del usuario (opcional, pero útil)
        localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

        alert("¡Bienvenido al Sistema Jamatex!");
        
        // --- REDIRECCIÓN ---
        // Nos movemos a la ruta /dashboard que definimos en App.jsx
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error en login:", err.response?.data || err.message);
      
      // Buscamos 'mensaje' porque así lo configuraste en tu authController.js
      const mensajeError = err.response?.data?.mensaje || "Credenciales incorrectas o error de servidor";
      setError(mensajeError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-medium">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-500">
        
        {/* CABECERA ESTILO JAMATEX (Coincide con tus otros módulos) */}
        <div className="bg-[#2c3e50] p-10 text-white text-center">
          <h2 className="text-4xl font-black tracking-tighter">JAMATEX</h2>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-2 opacity-70">
            Control de Inventario y Personal
          </p>
        </div>

        {/* FORMULARIO DE ACCESO */}
        <form onSubmit={manejarLogin} className="p-10 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Correo Corporativo</label>
            <input 
              required 
              type="email" 
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all text-sm"
              placeholder="correo@jamatex.com"
              value={credenciales.correo}
              onChange={(e) => setCredenciales({...credenciales, correo: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Contraseña</label>
            <input 
              required 
              type="password" 
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-[#2c3e50] transition-all text-sm"
              placeholder="••••••••"
              value={credenciales.contrasena}
              onChange={(e) => setCredenciales({...credenciales, contrasena: e.target.value})}
            />
          </div>

          {/* MENSAJE DE ERROR DINÁMICO */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-4 rounded-xl border border-red-100 font-bold text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-5 bg-[#2c3e50] text-white font-black rounded-2xl uppercase text-[11px] shadow-xl hover:bg-black hover:-translate-y-1 transition-all duration-300 tracking-widest"
          >
            Entrar al Sistema
          </button>
        </form>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold italic">
            Sesión protegida mediante encriptación AES-256
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;