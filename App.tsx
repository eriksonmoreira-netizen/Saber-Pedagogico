import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClassesPage } from './components/Classes';
import { StudentsPage } from './components/Students';
import { ReportsPage } from './components/Reports';
import { PricingPage } from './components/Pricing';
import { useStore, store } from './state/store';
import { Lock, Mail, User as UserIcon, Briefcase } from 'lucide-react';
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

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('DOCENTE');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = store.login(email);
      if (!success) {
        setError('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
      }
    } else {
       if (!name || !email) {
          setError('Preencha todos os campos obrigatórios.');
          return;
       }
       const success = store.register(name, email, role);
       if (!success) {
          setError('Este e-mail já está cadastrado.');
       }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Saber Pedagógico</h1>
          <p className="text-indigo-200">Portal de Gestão & Inteligência Educacional</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Seu nome"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Plano / Cargo</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={20} />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white transition-all"
                  >
                    <option value="DOCENTE">Plano Docente</option>
                    <option value="MESTRE">Plano Mestre</option>
                    <option value="MESTRE_PLUS">Plano Mestre Plus</option>
                  </select>
                </div>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
              <Lock size={18} />
              {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(!isLogin); 
                  setError('');
                }} 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça Login'}
              </button>
            </div>
            
            {isLogin && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
                <p className="font-bold mb-1">Acesso Demo:</p>
                <p>Super Adm: erikson.moreira@gmail.com</p>
                <p>Professora: ana@escola.com</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
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

const App: React.FC = () => {
  const { currentUser, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

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

export default App;