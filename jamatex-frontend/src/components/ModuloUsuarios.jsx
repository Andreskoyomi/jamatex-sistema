//Importación de herramientas de React y estilos
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Librería para conectar con el servidor (API)

const ModuloUsuarios = () => {
  // ESTADOS GLOBALES 
  const [usuarios, setUsuarios] = useState([]); // Lista completa de usuarios desde la DB
  const [busqueda, setBusqueda] = useState(''); // Término de búsqueda para el filtro
  const [verDesactivados, setVerDesactivados] = useState(false); // Switch entre vista Activos / Inactivos
  
  // ESTADOS PARA MODALES 
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario que se está editando

  // ESTADO PARA NUEVO USUARIO 
  // Nota: Se usa 'contrasena' sin Ñ para evitar errores de codificación en el backend/DB
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', correo: '', contrasena: '', rol: 'Auxiliar de Bodega', estado: 1
  });

  // Carga inicial de datos al montar el componente
  useEffect(() => { obtenerUsuarios(); }, []);

  // Función para traer todos los usuarios de la API
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/usuarios');
      setUsuarios(respuesta.data);
    } catch (error) { 
        console.error("Error al obtener usuarios:", error); 
    }
  };

  // Lógica para registrar un usuario nuevo (POST)
  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/usuarios', nuevoUsuario);
      setMostrarModalCrear(false);
      setNuevoUsuario({ nombre: '', correo: '', contrasena: '', rol: 'Auxiliar de Bodega', estado: 1 });
      obtenerUsuarios();
      alert("Usuario registrado con éxito");
    } catch (error) { 
      // Log detallado para ver qué dice el servidor
      console.error("Error detallado:", error.response?.data || error.message);
      alert("Error al registrar: " + (error.response?.data?.message || "Revisa la consola")); 
    }
  };

  // Lógica para actualizar datos de un usuario existente (PUT)
  const manejarEdicion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/usuarios/${usuarioSeleccionado.id_usuario}`, usuarioSeleccionado);
      setMostrarModalEditar(false);
      obtenerUsuarios();
      alert("Usuario actualizado correctamente");
    } catch (error) { alert("Error al actualizar usuario"); }
  };

  // LÓGICA DE BORRADO LÓGICO: 
  // No elimina el registro de la DB, solo cambia su 'estado' (0 = Inactivo, 1 = Activo)
  const cambiarEstadoUsuario = async (u, nuevoEstado) => {
    const accion = nuevoEstado === 1 ? 'reactivar' : 'desactivar';
    if (window.confirm(`¿Seguro que quieres ${accion} a ${u.nombre}?`)) {
      try {
        await axios.put(`http://localhost:3000/usuarios/${u.id_usuario}`, { 
            ...u, 
            estado: nuevoEstado 
        });
        obtenerUsuarios();
      } catch (error) { alert("Error al cambiar estado"); }
    }
  };

  // FILTRADO DE LA LISTA 
  // Filtra por: 1. Estado (Activo/Inactivo) y 2. Búsqueda por nombre o correo
  const usuariosFiltrados = usuarios.filter(u => {
    const estadoMatch = verDesactivados ? Number(u.estado) === 0 : Number(u.estado) === 1;
    const term = busqueda.toLowerCase().trim();
    return estadoMatch && (
        u.nombre.toLowerCase().includes(term) || 
        u.correo.toLowerCase().includes(term)
    );
  });

  // Estilos visuales según el rol asignado
  const getRolStyle = (rol) => {
    switch (rol) {
      case 'Administrador': return 'bg-slate-800 text-white';
      case 'Jefe de Bodega': return 'bg-blue-100 text-blue-700';
      case 'Auxiliar de Bodega': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  //INTERFAZ VISUAL (JSX)
  return (
    <div className="animate-in fade-in duration-500">
      {/* CABECERA */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-black text-[#2c3e50]">Gestión de Personal</h3>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1 italic">
            {verDesactivados ? '📂 Archivo de personal inactivo' : '👥 Equipo de bodega activo'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setVerDesactivados(!verDesactivados)} 
            className={`px-4 py-3 rounded-xl font-bold text-[10px] border transition-all ${verDesactivados ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
          >
            {verDesactivados ? '⬅ VER ACTIVOS' : '📂 VER DESACTIVADOS'}
          </button>
          <button onClick={() => setMostrarModalCrear(true)} className="bg-[#2c3e50] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg hover:bg-black transition-all">
            + AGREGAR USUARIO
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 font-medium">
        <input 
          type="text" 
          placeholder="Buscar por nombre o correo..." 
          className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#2c3e50] text-sm border-none" 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </div>

      {/* TABLA */}
      <div className={`rounded-3xl shadow-xl overflow-hidden border transition-all duration-500 ${verDesactivados ? 'border-slate-200 bg-slate-50/50' : 'bg-white border-slate-100'}`}>
        <table className="w-full text-sm text-left">
          <thead className={`${verDesactivados ? 'bg-[#475569]' : 'bg-[#2c3e50]'} text-white text-[10px] uppercase tracking-widest`}>
            <tr>
              <th className="p-5 font-black">Nombre / ID</th>
              <th className="p-5 font-black">Correo Electrónico</th>
              <th className="p-5 text-center font-black">Rol Asignado</th>
              <th className="p-5 text-center font-black">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map(u => (
                <tr key={u.id_usuario} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-700">{u.nombre}</div>
                    <div className="text-[10px] text-slate-400 font-mono italic">ID: {u.id_usuario}</div>
                  </td>
                  <td className="p-5 text-slate-500 font-medium">{u.correo}</td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight ${getRolStyle(u.rol)}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-4">
                      {verDesactivados ? (
                        <button onClick={() => cambiarEstadoUsuario(u, 1)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black hover:bg-emerald-600 shadow-md">REACTIVAR</button>
                      ) : (
                        <>
                          <button onClick={() => { setUsuarioSeleccionado(u); setMostrarModalEditar(true); }} className="text-blue-500 hover:scale-125 transition-transform text-lg">✏️</button>
                          <button onClick={() => cambiarEstadoUsuario(u, 0)} className="text-red-400 hover:scale-125 transition-transform text-lg">🗑️</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-400 font-bold italic">No hay registros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR - CAMPO contrasena SIN Ñ */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-[#2c3e50] p-4 text-white font-bold flex justify-between items-center text-[10px] uppercase">
              <span>Nuevo Usuario Jamatex</span>
              <button onClick={() => setMostrarModalCrear(false)}>✕</button>
            </div>
            <form onSubmit={manejarRegistro} className="p-8 space-y-4">
              <input required placeholder="Nombre Completo" className="w-full p-3 bg-slate-50 rounded-xl border text-sm" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} />
              <input required type="email" placeholder="Correo Corporativo" className="w-full p-3 bg-slate-50 rounded-xl border text-sm" value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})} />
              <input required type="password" placeholder="Contraseña de acceso" className="w-full p-3 bg-slate-50 rounded-xl border text-sm" value={nuevoUsuario.contrasena} onChange={(e) => setNuevoUsuario({...nuevoUsuario, contrasena: e.target.value})} />
              <select className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold text-slate-600" value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}>
                <option value="Administrador">Administrador</option>
                <option value="Jefe de Bodega">Jefe de Bodega</option>
                <option value="Auxiliar de Bodega">Auxiliar de Bodega</option>
                <option value="Consulta">Consulta (Solo Lectura)</option>
              </select>
              <button type="submit" className="w-full py-4 bg-[#2c3e50] text-white font-black rounded-2xl uppercase text-xs shadow-lg mt-4">Crear Usuario</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {mostrarModalEditar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center text-[10px] uppercase">
              <span>Editar Usuario: {usuarioSeleccionado.id_usuario}</span>
              <button onClick={() => setMostrarModalEditar(false)}>✕</button>
            </div>
            <form onSubmit={manejarEdicion} className="p-8 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1">NOMBRE</label>
                <input required className="p-3 bg-slate-50 rounded-xl border text-sm" value={usuarioSeleccionado.nombre} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, nombre: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1">CORREO</label>
                <input required className="p-3 bg-slate-50 rounded-xl border text-sm" value={usuarioSeleccionado.correo} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, correo: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1">ROL</label>
                <select className="p-3 bg-slate-50 rounded-xl border text-sm font-bold text-slate-600" value={usuarioSeleccionado.rol} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, rol: e.target.value})}>
                  <option value="Administrador">Administrador</option>
                  <option value="Jefe de Bodega">Jefe de Bodega</option>
                  <option value="Auxiliar de Bodega">Auxiliar de Bodega</option>
                  <option value="Consulta">Consulta (Solo Lectura)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs shadow-lg mt-4">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloUsuarios;