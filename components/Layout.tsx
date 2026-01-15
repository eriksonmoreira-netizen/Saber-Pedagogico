import React from 'react';
import { useStore, store } from '../state/store';
import { HashRouter, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  LogOut, 
  Menu,
  ShieldAlert,
  FileBarChart
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const isSuperAdm = currentUser.role === 'SUPER_ADM';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SP</span>
          </div>
          <span className="text-lg font-bold text-slate-800">Saber Pedagógico</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/turmas" icon={Users} label="Turmas" active={location.pathname === '/turmas'} />
          <SidebarItem to="/alunos" icon={GraduationCap} label="Alunos" active={location.pathname === '/alunos'} />
          <SidebarItem to="/relatorios" icon={FileBarChart} label="Relatórios" active={location.pathname === '/relatorios'} />
          <SidebarItem to="/financeiro" icon={CreditCard} label="Planos & Financeiro" active={location.pathname === '/financeiro'} />
          {isSuperAdm && (
             <SidebarItem to="/super-adm" icon={ShieldAlert} label="Super Admin" active={location.pathname === '/super-adm'} />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
               <p className="text-xs text-slate-500 truncate">{currentUser.role.replace('_', ' ')}</p>
             </div>
          </div>
          <button 
            onClick={() => store.logout()}
            className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={18} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <span className="font-bold text-slate-800">Saber Pedagógico</span>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <Menu className="text-slate-600" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
           <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl z-50 border-b border-slate-200 p-4 flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-700">Dashboard</Link>
              <Link to="/turmas" onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-700">Turmas</Link>
              <Link to="/alunos" onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-700">Alunos</Link>
              <Link to="/relatorios" onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-700">Relatórios</Link>
              <button onClick={() => store.logout()} className="p-2 text-red-600 text-left">Sair</button>
           </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};