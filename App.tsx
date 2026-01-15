import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClassesPage } from './components/Classes';
import { StudentsPage } from './components/Students';
import { ReportsPage } from './components/Reports';
import { PricingPage } from './components/Pricing';
import { Login } from './components/Login';
import { useStore } from './state/store';
import { Lock } from 'lucide-react';
import { UserRole } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactElement, roles?: UserRole[] }) => {
  const { currentUser, isAuthenticated } = useStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Lock size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500 mt-2">Seu plano atual não permite acessar este recurso.</p>
        <p className="text-sm text-indigo-600 mt-4 cursor-pointer" onClick={() => window.location.hash = '#/financeiro'}>
          Fazer Upgrade
        </p>
      </div>
    );
  }

  return children;
};

const SuperAdmDashboard = () => (
  <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
    <h1 className="text-2xl font-bold text-red-800 mb-4">Área Restrita: Super Admin</h1>
    <p className="text-red-700">Painel exclusivo para controle global do sistema.</p>
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">Monitoramento de Servidores (Mock)</div>
      <div className="bg-white p-4 rounded shadow">Logs de Auditoria (Mock)</div>
    </div>
  </div>
);

// MainContainer Component (Equivalent to src/app/page.tsx logic)
const MainContainer: React.FC = () => {
  const { currentUser } = useStore();
  const [mounted, setMounted] = useState(false);

  // Tratamento de Hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  // Se não houver usuário, renderize Login
  if (!currentUser) {
    return <Login />;
  }

  // Se houver usuário, renderize o App com Layout
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/turmas" element={<ClassesPage />} />
          <Route path="/alunos" element={<StudentsPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/financeiro" element={<PricingPage />} />
          <Route 
            path="/super-adm" 
            element={
              <ProtectedRoute roles={['SUPER_ADM']}>
                 <SuperAdmDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default MainContainer;