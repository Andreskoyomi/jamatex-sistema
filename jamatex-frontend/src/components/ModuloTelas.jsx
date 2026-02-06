//Importación de herramientas de React y estilos
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Librería para conectar con el servidor (API)

const ModuloTelas = () => {
  // 1. ESTADOS
  const [telas, setTelas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [verDesactivados, setVerDesactivados] = useState(false);
  
  // Modales (Control de ventanas emergentes)
  const [mostrarModalDescuento, setMostrarModalDescuento] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  // Estados para manejar la selección y edición
  const [telaSeleccionada, setTelaSeleccionada] = useState(null);
  const [metrosADescontar, setMetrosADescontar] = useState('');

  // Estado para nueva tela
  const [nuevaTela, setNuevaTela] = useState({
    codigo: '', material: '', color: '', diseno: '', 
    metros_disponibles: '', ancho: '', ubicacion: '', estado: 1
  });

  //EFECTOS Y FUNCIONES DE CARGA
// useEffect: Se ejecuta una sola vez cuando se abre el módulo
  useEffect(() => { obtenerTelas(); }, []);

  // Función para traer los datos desde la base de datos (vía API)
  const obtenerTelas = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/telas');
      setTelas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener telas:", error);
    }
  };

  // FUNCIONES DE GESTIÓN (CRUD)
  // BORRADO LÓGICO: Cambia el estado de 1 (Activo) a 0 (Inactivo) o viceversa
  const cambiarEstadoTela = async (tela, nuevoEstado) => {
    const accion = nuevoEstado === 1 ? 'reactivar' : 'desactivar';
    if (window.confirm(`¿Seguro que quieres ${accion} la tela ${tela.codigo}?`)) {
      try {
        await axios.put(`http://localhost:3000/telas/${tela.id_tela}`, {
          ...tela,
          estado: nuevoEstado
        });
        obtenerTelas();
      } catch (error) { alert("Error al cambiar el estado"); }
    }
  };

  // ACTUALIZAR: Envía los cambios realizados en el modal de edición
  const manejarEdicion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/telas/${telaSeleccionada.id_tela}`, telaSeleccionada);
      setMostrarModalEditar(false);
      obtenerTelas();
      alert("Información actualizada correctamente");
    } catch (error) { alert("Error al actualizar"); }
  };

  // GESTIÓN DE INVENTARIO: Resta metros del stock actual
  const manejarDescuento = async (e) => {
    e.preventDefault();
    const descuento = parseFloat(metrosADescontar);
    const stockActual = parseFloat(telaSeleccionada.metros_disponibles);
    if (descuento > stockActual) { alert("No hay suficiente stock"); return; }

    try {
      await axios.put(`http://localhost:3000/telas/${telaSeleccionada.id_tela}`, {
        ...telaSeleccionada,
        metros_disponibles: stockActual - descuento
      });
      setMostrarModalDescuento(false);
      setMetrosADescontar('');
      obtenerTelas();
    } catch (error) { alert("Error al descontar stock"); }
  };

  // REGISTRAR: Crea una nueva tela en la base de datos
  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/telas', nuevaTela);
      setMostrarModalCrear(false);
      // Resetear formulario con diseño vacío
      setNuevaTela({ codigo: '', material: '', color: '', diseno: '', metros_disponibles: '', ancho: '', ubicacion: '', estado: 1 });
      obtenerTelas();
    } catch (error) { alert("Error al registrar"); }
  };

  // LÓGICA DE FILTRADO
  const telasFiltradas = telas.filter(t => {
    const estadoMatch = verDesactivados ? Number(t.estado) === 0 : Number(t.estado) === 1;
    const term = busqueda.toLowerCase().trim();
    const buscaMatch = t.codigo.toLowerCase().includes(term) || 
                       t.material.toLowerCase().includes(term) ||
                       t.color.toLowerCase().includes(term);
    return estadoMatch && buscaMatch;
  });


  //INTERFAZ VISUAL (JSX)
  return (
    <div className="animate-in fade-in duration-500">
      {/* CABECERA */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-black text-[#2c3e50]">Inventario Jamatex</h3>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1 italic">
            {verDesactivados ? '📂 Archivo de registros inactivos' : '🟢 Control de stock activo'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setVerDesactivados(!verDesactivados)}
            className={`px-4 py-3 rounded-xl font-bold text-[10px] transition-all border ${verDesactivados ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
          >
            {verDesactivados ? '⬅ VOLVER A BODEGA' : '📂 VER DESACTIVADOS'}
          </button>
          <button onClick={() => setMostrarModalCrear(true)} className="bg-[#2c3e50] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg hover:bg-black transition-all">
            + INGRESAR PRODUCTO
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 font-medium">
        <input 
          type="text" 
          placeholder="Buscar por código, material o color..." 
          className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#2c3e50] text-sm border-none" 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </div>

      {/* TABLA PRINCIPAL */}
      <div className={`rounded-3xl shadow-xl overflow-hidden border transition-all duration-500 ${verDesactivados ? 'border-slate-200 bg-slate-50/50' : 'bg-white border-slate-100'}`}>
        <table className="w-full text-sm text-left">
          <thead className={`${verDesactivados ? 'bg-[#475569]' : 'bg-[#2c3e50]'} text-white text-[10px] uppercase tracking-widest transition-colors duration-500`}>
            <tr>
              <th className="p-5 font-black">Código</th>
              <th className="p-5 font-black">Material / Diseño</th>
              <th className="p-5 font-black">Color</th>
              <th className="p-5 text-center font-black">Stock</th>
              <th className="p-5 text-center font-black">Ubicación</th>
              <th className="p-5 text-center font-black">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {telasFiltradas.length > 0 ? (
              telasFiltradas.map(tela => (
                <tr key={tela.id_tela} className="hover:bg-slate-100/50 transition-colors">
                  <td className="p-5 font-bold text-[#2c3e50] font-mono">
                    {tela.codigo}
                    {verDesactivados && <span className="ml-2 text-[8px] bg-slate-200 text-slate-500 px-1 rounded">OFF</span>}
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-slate-700">{tela.material}</div>
                    <div className="text-[10px] text-blue-500 uppercase font-black">{tela.diseno || 'Liso'}</div>
                  </td>
                  <td className="p-5 uppercase text-xs text-slate-500 font-bold">{tela.color}</td>
                  <td className="p-5 text-center font-black text-[#2c3e50] text-base">{parseFloat(tela.metros_disponibles).toFixed(2)}m</td>
                  <td className="p-5 text-center font-bold text-xs uppercase"><span className="bg-slate-100 px-2 py-1 rounded text-slate-500">{tela.ubicacion || 'N/A'}</span></td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-4">
                      {!verDesactivados ? (
                        <>
                          <button onClick={() => { setTelaSeleccionada(tela); setMostrarModalEditar(true); }} className="text-blue-500 hover:scale-120 text-lg">✏️</button>
                          <button onClick={() => cambiarEstadoTela(tela, 0)} className="text-red-400 hover:scale-120 text-lg">🗑️</button>
                          <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                          <button onClick={() => { setTelaSeleccionada(tela); setMostrarModalDescuento(true); }} className="bg-[#2c3e50] text-white px-4 py-2 rounded-lg font-bold text-[10px]">USAR</button>
                        </>
                      ) : (
                        <button onClick={() => cambiarEstadoTela(tela, 1)} className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-[10px] hover:bg-emerald-600 shadow-md transition-all">
                          Reactivar en Stock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-20 text-center text-slate-400 font-bold italic">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITAR */}
      {mostrarModalEditar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center text-xs uppercase">
              <span>Editar Tela: {telaSeleccionada.codigo}</span>
              <button onClick={() => setMostrarModalEditar(false)}>✕</button>
            </div>
            <form onSubmit={manejarEdicion} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Código" className="p-3 bg-slate-50 rounded-xl outline-none border" value={telaSeleccionada.codigo} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, codigo: e.target.value})} />
                <input required placeholder="Color" className="p-3 bg-slate-50 rounded-xl outline-none border" value={telaSeleccionada.color} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, color: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Material" className="p-3 bg-slate-50 rounded-xl outline-none border" value={telaSeleccionada.material} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, material: e.target.value})} />
                <input placeholder="Diseño (Estampado, Liso, etc.)" className="p-3 bg-slate-50 rounded-xl outline-none border" value={telaSeleccionada.diseno || ''} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, diseno: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="0.01" className="p-3 bg-slate-50 rounded-xl outline-none border font-bold" value={telaSeleccionada.metros_disponibles} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, metros_disponibles: e.target.value})} />
                <input placeholder="Ubicación" className="p-3 bg-slate-50 rounded-xl outline-none border" value={telaSeleccionada.ubicacion || ''} onChange={(e) => setTelaSeleccionada({...telaSeleccionada, ubicacion: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs hover:bg-blue-700 shadow-lg">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR - CAMPO DISEÑO AÑADIDO */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-[#2c3e50] p-4 text-white font-bold flex justify-between items-center text-xs uppercase">
              <span>Nuevo Registro Bodega</span>
              <button onClick={() => setMostrarModalCrear(false)}>✕</button>
            </div>
            <form onSubmit={manejarRegistro} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Código" className="p-3 bg-slate-50 rounded-xl outline-none border" value={nuevaTela.codigo} onChange={(e) => setNuevaTela({...nuevaTela, codigo: e.target.value})} />
                <input required placeholder="Color" className="p-3 bg-slate-50 rounded-xl outline-none border" value={nuevaTela.color} onChange={(e) => setNuevaTela({...nuevaTela, color: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Material" className="p-3 bg-slate-50 rounded-xl outline-none border" value={nuevaTela.material} onChange={(e) => setNuevaTela({...nuevaTela, material: e.target.value})} />
                <input placeholder="Diseño (Ej: Lisa, Rombos)" className="p-3 bg-slate-50 rounded-xl outline-none border" value={nuevaTela.diseno} onChange={(e) => setNuevaTela({...nuevaTela, diseno: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input required type="number" step="0.01" placeholder="Metros" className="p-3 bg-slate-50 rounded-xl outline-none border font-bold" value={nuevaTela.metros_disponibles} onChange={(e) => setNuevaTela({...nuevaTela, metros_disponibles: e.target.value})} />
                <input type="number" step="0.01" placeholder="Ancho" className="p-3 bg-slate-50 rounded-xl outline-none border font-bold" value={nuevaTela.ancho} onChange={(e) => setNuevaTela({...nuevaTela, ancho: e.target.value})} />
                <input placeholder="Ubicación" className="p-3 bg-slate-50 rounded-xl outline-none border uppercase" value={nuevaTela.ubicacion} onChange={(e) => setNuevaTela({...nuevaTela, ubicacion: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-[#2c3e50] text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-lg hover:bg-black transition-all">Registrar en Bodega</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DESCUENTO */}
      {mostrarModalDescuento && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center border border-slate-200">
             <div className="bg-[#2c3e50] p-4 text-white font-bold flex justify-between items-center text-xs uppercase">
                <span>Descontar Metros</span>
                <button onClick={() => setMostrarModalDescuento(false)}>✕</button>
             </div>
             <form onSubmit={manejarDescuento} className="p-8 text-center">
                <div className="mb-4 text-3xl font-black text-[#2c3e50]">{parseFloat(telaSeleccionada.metros_disponibles).toFixed(2)}m</div>
                <input required autoFocus type="number" step="0.01" className="w-full p-4 bg-slate-50 border-2 rounded-2xl text-center text-2xl font-black" placeholder="0.00" value={metrosADescontar} onChange={(e) => setMetrosADescontar(e.target.value)} />
                <button type="submit" className="w-full mt-6 py-4 bg-[#2c3e50] text-white font-black rounded-2xl uppercase text-xs">Confirmar</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloTelas;