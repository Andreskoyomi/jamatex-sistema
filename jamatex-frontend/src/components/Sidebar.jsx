export default function Sidebar({ setModuloActual, moduloActual }) {
  const menus = [
    { id: 'inventario', label: 'Gestión de Inventarios', icon: '📦' },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: '👤' },
  ];

  return (
    // En el return de Sidebar.jsx, verifica que la primera línea diga:
    <aside className="w-64 bg-[#2c3e50] text-white flex flex-col fixed h-full shadow-2xl z-20">
      <div className="p-8 border-b border-slate-700">
        <h1 className="text-xl font-black italic tracking-tighter">JAMATEX</h1>
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Gestión de Inventarios</p>
      </div>
      <nav className="flex-1 mt-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setModuloActual(menu.id)}
            className={`w-full flex items-center px-6 py-4 gap-4 text-sm font-medium transition-all 
              ${moduloActual === menu.id ? 'bg-[#34495e] border-r-4 border-blue-400' : 'text-slate-400 hover:bg-[#34495e] hover:text-white'}`}
          >
            <span>{menu.icon}</span> {menu.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}