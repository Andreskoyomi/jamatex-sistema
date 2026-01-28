// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-white h-20 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
      <h2 className="text-[#2c3e50] font-black text-xs uppercase tracking-[0.2em]">
        Sistema de gestión de inventarios Jamatex
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
          Andrés Lozada <br/> <span className="text-emerald-500">En línea</span>
        </span>
        <div className="w-10 h-10 bg-[#2c3e50] rounded-full flex items-center justify-center text-white font-bold text-xs">AL</div>
      </div>
    </header>
  );
}