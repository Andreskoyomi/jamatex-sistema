import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [telas, setTelas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [mostrarModalDescuento, setMostrarModalDescuento] = useState(false);
  
  // Datos de operación
  const [telaSeleccionada, setTelaSeleccionada] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [metrosADescontar, setMetrosADescontar] = useState('');

  const [formData, setFormData] = useState({
    codigo: '', material: '', color: '', diseno: '', 
    metros_disponibles: '', ancho: '', ubicacion: '', estado: 1
  });

  useEffect(() => { obtenerTelas(); }, []);

  const obtenerTelas = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/telas');
      setTelas(respuesta.data);
    } catch (error) { console.error(error); }
  };

  // --- ACCIÓN: GUARDAR (CREAR O EDITAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3000/telas/${editandoId}`, formData);
      } else {
        await axios.post('http://localhost:3000/telas', formData);
      }
      cerrarModalForm();
      obtenerTelas();
    } catch (error) { alert("Error al procesar la solicitud"); }
  };

  // --- ACCIÓN: DESCONTAR METROS ---
  const manejarDescuento = async (e) => {
    e.preventDefault();
    const descuento = parseFloat(metrosADescontar);
    const stockActual = parseFloat(telaSeleccionada.metros_disponibles);

    if (descuento > stockActual) {
      alert("No hay suficiente stock.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/telas/${telaSeleccionada.id_tela}`, {
        ...telaSeleccionada,
        metros_disponibles: stockActual - descuento
      });
      setMostrarModalDescuento(false);
      setMetrosADescontar('');
      obtenerTelas();
    } catch (error) { alert("Error al actualizar stock"); }
  };

  // --- ACCIÓN: BORRAR (BAJA) ---
  const eliminarTela = async (id) => {
    if (window.confirm("¿Seguro que desea dar de baja esta tela?")) {
      try {
        await axios.delete(`http://localhost:3000/telas/${id}`);
        obtenerTelas();
      } catch (error) { alert("Error al eliminar"); }
    }
  };

  const prepararEdicion = (tela) => {
    setEditandoId(tela.id_tela);
    setFormData({ ...tela, diseno: tela.diseno || '', ancho: tela.ancho || '', ubicacion: tela.ubicacion || '' });
    setMostrarModalForm(true);
  };

  const cerrarModalForm = () => {
    setMostrarModalForm(false);
    setEditandoId(null);
    setFormData({ codigo: '', material: '', color: '', diseno: '', metros_disponibles: '', ancho: '', ubicacion: '', estado: 1 });
  };

  const telasFiltradas = telas.filter(t => 
    t.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.material.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-left text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#2c3e50]">
          <div>
            <h1 className="text-3xl font-black italic text-[#2c3e50]">JAMATEX</h1>
            <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">Panel de Inventario</p>
          </div>
          <button 
            onClick={() => setMostrarModalForm(true)} 
            className="bg-[#2c3e50] text-white font-bold py-2.5 px-6 rounded-lg hover:bg-[#1a252f] transition-all shadow-md"
          >
            + Nueva Tela
          </button>
        </header>

        {/* Buscador */}
        <div className="mb-6">
          <input 
            type="text" placeholder="Filtrar por código o material..." 
            className="w-full p-4 rounded-xl shadow-sm border-none outline-none focus:ring-2 focus:ring-[#2c3e50]"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
          />
        </div>

        {/* Tabla Principal */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2c3e50] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 text-left font-black">Identificación</th>
                  <th className="p-4 text-left font-black">Material y Color</th>
                  <th className="p-4 text-center font-black">Stock (m)</th>
                  <th className="p-4 text-center font-black">Ancho</th>
                  <th className="p-4 text-left font-black">Ubicación</th>
                  <th className="p-4 text-center font-black">Operaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {telasFiltradas.map(tela => (
                  <tr key={tela.id_tela} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#2c3e50]">{tela.codigo}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{tela.material}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{tela.color} {tela.diseno && `| ${tela.diseno}`}</div>
                    </td>
                    <td className="p-4 text-center font-black text-slate-800 text-base">
                      {parseFloat(tela.metros_disponibles).toFixed(2)}m
                    </td>
                    <td className="p-4 text-center text-slate-500 text-xs">
                      {tela.ancho ? `${tela.ancho}m` : '---'}
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {tela.ubicacion || '---'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-1">
                        {/* ACCIÓN 1: USAR (Descontar) */}
                        <button 
                          onClick={() => { setTelaSeleccionada(tela); setMostrarModalDescuento(true); }}
                          className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-600 hover:text-white transition-all font-bold text-[10px] flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                          USAR
                        </button>
                        
                        {/* ACCIÓN 2: EDITAR */}
                        <button 
                          onClick={() => prepararEdicion(tela)}
                          className="p-2 text-slate-400 hover:text-[#2c3e50] hover:bg-slate-100 rounded-md transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>

                        {/* ACCIÓN 3: BORRAR */}
                        <button 
                          onClick={() => eliminarTela(tela.id_tela)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: REGISTRO / EDICIÓN */}
        {mostrarModalForm && (
          <div className="fixed inset-0 bg-[#2c3e50]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="bg-[#2c3e50] p-4 text-white font-bold flex justify-between">
                <span>{editandoId ? 'MODIFICAR REGISTRO' : 'NUEVO INGRESO'}</span>
                <button onClick={cerrarModalForm}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Código</label>
                  <input required className="w-full p-2 border rounded-md" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Material</label>
                  <input required className="w-full p-2 border rounded-md" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Color</label>
                  <input required className="w-full p-2 border rounded-md" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Diseño</label>
                  <input className="w-full p-2 border rounded-md" value={formData.diseno} onChange={e => setFormData({...formData, diseno: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Metros Disponibles</label>
                  <input required type="number" step="0.01" className="w-full p-2 border rounded-md" value={formData.metros_disponibles} onChange={e => setFormData({...formData, metros_disponibles: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Ancho</label>
                  <input type="number" step="0.01" className="w-full p-2 border rounded-md" value={formData.ancho} onChange={e => setFormData({...formData, ancho: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Ubicación</label>
                  <input className="w-full p-2 border rounded-md" value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} />
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" onClick={cerrarModalForm} className="text-slate-400 font-bold px-4">Cancelar</button>
                  <button type="submit" className="bg-[#2c3e50] text-white px-6 py-2 rounded-md font-bold uppercase text-xs tracking-widest">
                    {editandoId ? 'Guardar Cambios' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DESCUENTO (USAR) */}
        {mostrarModalDescuento && (
          <div className="fixed inset-0 bg-[#2c3e50]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-[#2c3e50] p-4 text-white font-bold flex justify-between">
                <span className="text-xs uppercase tracking-widest">Registrar Uso</span>
                <button onClick={() => setMostrarModalDescuento(false)}>✕</button>
              </div>
              <form onSubmit={manejarDescuento} className="p-8 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tela Seleccionada</p>
                <h3 className="text-[#2c3e50] font-black text-xl mb-6">{telaSeleccionada.material}</h3>
                
                <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Stock Actual</span>
                  <span className="text-2xl font-black text-[#2c3e50]">{parseFloat(telaSeleccionada.metros_disponibles).toFixed(2)}m</span>
                </div>
                
                <label className="block text-left text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Metros a descontar</label>
                <input 
                  required autoFocus type="number" step="0.01" 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-center text-3xl font-black text-[#2c3e50] outline-none focus:border-[#2c3e50]"
                  value={metrosADescontar}
                  onChange={(e) => setMetrosADescontar(e.target.value)}
                />
                
                <button type="submit" className="w-full mt-6 py-4 bg-[#2c3e50] text-white font-black rounded-xl shadow-lg hover:bg-[#1a252f] transition-all uppercase tracking-widest text-xs">
                  Confirmar Salida
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;