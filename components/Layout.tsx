import React from 'react';
import { useStore, store } from '../state/store';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  LogOut, 
  Menu,
  ShieldAlert,
  FileBarChart,
  BookOpen
} from 'lucide-react';

// Access Control Logic
const checkAccess = (role: string, feature: string) => {
  const plans = {
    'DOCENTE': ['dashboard', 'classes', 'students', 'pricing'],
    'MESTRE': ['dashboard', 'classes', 'students', 'reports', 'pricing'],
    'MESTRE_PLUS': ['dashboard', 'classes', 'students', 'reports', 'pricing', 'ai'],
    'SUPER_ADM': ['dashboard', 'classes', 'students', 'reports', 'pricing', 'ai', 'admin']
  };
  const allowed = plans[role as keyof typeof plans] || [];
  return allowed.includes(feature);
};

const SidebarItem = ({ to, icon: Icon, label, active, restricted = false }: any) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
    } ${restricted ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-600' : ''}`}
    onClick={(e) => restricted && e.preventDefault()}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
    <span className="font-medium">{label}</span>
    {restricted && <span className="ml-auto text-[10px] uppercase bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">Lock</span>}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const role = currentUser.role;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BookOpen className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Saber</h1>
            <p className="text-xs text-indigo-600 font-semibold tracking-wide">PEDAGÓGICO</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-2">Principal</div>
          
          <SidebarItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Visão Geral" 
            active={location.pathname === '/'} 
          />
          <SidebarItem 
            to="/turmas" 
            icon={Users} 
            label="Minhas Turmas" 
            active={location.pathname === '/turmas'} 
          />
          <SidebarItem 
            to="/alunos" 
            icon={GraduationCap} 
            label="Alunos & Notas" 
            active={location.pathname === '/alunos'} 
          />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-6">Gestão</div>

          <SidebarItem 
            to="/relatorios" 
            icon={FileBarChart} 
            label="Relatórios" 
            active={location.pathname === '/relatorios'}
            restricted={!checkAccess(role, 'reports')}
          />
          <SidebarItem 
            to="/financeiro" 
            icon={CreditCard} 
            label="Meu Plano" 
            active={location.pathname === '/financeiro'} 
          />
          
          {checkAccess(role, 'admin') && (
            <>
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider px-4 mb-2 mt-6">Admin</div>
              <SidebarItem 
                to="/super-adm" 
                icon={ShieldAlert} 
                label="Super Admin" 
                active={location.pathname === '/super-adm'} 
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
               <p className="text-[10px] text-indigo-600 font-bold uppercase truncate border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                 {currentUser.role.replace('_', ' ')}
               </p>
             </div>
          </div>
          <button 
            onClick={() => store.logout()}
            className="flex items-center justify-center space-x-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all w-full py-2.5 rounded-lg text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20 relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
            <span className="font-bold text-slate-800">Saber Pedagógico</span>
          </div>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 active:bg-slate-100 rounded-lg">
            <Menu className="text-slate-600" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
           <div className="md:hidden absolute top-[65px] left-0 w-full bg-white shadow-2xl z-30 border-b border-slate-200 p-2 animate-fade-in-down">
              <nav className="flex flex-col space-y-1">
                <Link to="/" onClick={() => setIsMobileOpen(false)} className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium">Dashboard</Link>
                <Link to="/turmas" onClick={() => setIsMobileOpen(false)} className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium">Turmas</Link>
                <Link to="/alunos" onClick={() => setIsMobileOpen(false)} className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium">Alunos</Link>
                <button onClick={() => store.logout()} className="p-3 text-red-600 text-left font-medium hover:bg-red-50 rounded-lg w-full">Sair</button>
              </nav>
           </div>
        )}

        <div className="flex-1 overflow-auto p-6 md:p-8 relative scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};