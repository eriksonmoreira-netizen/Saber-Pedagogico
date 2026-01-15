'use client';

import React from 'react';
import { useStore, store } from '../state/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  LogOut, 
  Menu,
  ShieldAlert,
  FileBarChart,
  BookOpen,
  UserCircle
} from 'lucide-react';
import { UserRole } from '../types';

const getMenuItems = (role: UserRole, email: string) => {
  const items = [
    { to: '/', icon: LayoutDashboard, label: 'Visão Geral' },
    { to: '/turmas', icon: Users, label: 'Turmas' },
    { to: '/financeiro', icon: UserCircle, label: 'Perfil & Plano' },
  ];

  if (['DOCENTE', 'MESTRE', 'MESTRE_PLUS', 'SUPER_ADM'].includes(role)) {
    items.splice(2, 0, { to: '/alunos', icon: GraduationCap, label: 'Alunos & Tutoria' });
  }

  if (['MESTRE', 'MESTRE_PLUS', 'SUPER_ADM'].includes(role)) {
    items.push({ to: '/relatorios', icon: FileBarChart, label: 'Planejamento BNCC' });
  }

  if (email === 'erikson.moreira@gmail.com' || role === 'SUPER_ADM') {
    items.push({ to: '/super-adm', icon: ShieldAlert, label: 'Painel Admin' });
  }

  return items;
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const menuItems = getMenuItems(currentUser.role, currentUser.email);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 transition-all duration-300">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BookOpen className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Saber</h1>
            <p className="text-xs text-indigo-600 font-semibold tracking-wide">PEDAGÓGICO</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-2">Menu Principal</div>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link 
                key={item.to}
                href={item.to} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
               {currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
               <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
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

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50/50">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
            <span className="font-bold text-slate-800">Saber Pedagógico</span>
          </div>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 active:bg-slate-100 rounded-lg text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {isMobileOpen && (
           <div className="md:hidden absolute top-[65px] left-0 w-full bg-white shadow-2xl z-30 border-b border-slate-200 p-2">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                   <Link 
                    key={item.to}
                    href={item.to} 
                    onClick={() => setIsMobileOpen(false)} 
                    className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium"
                   >
                     <item.icon size={18} />
                     <span>{item.label}</span>
                   </Link>
                ))}
                <div className="h-px bg-slate-100 my-2"></div>
                <button onClick={() => store.logout()} className="p-3 text-red-600 text-left font-medium hover:bg-red-50 rounded-lg w-full flex items-center space-x-3">
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
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