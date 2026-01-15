import React, { useState } from 'react';
import { store, useStore } from '../state/store';
import { UserRole } from '../types';
import { Lock, Mail, User as UserIcon, Briefcase } from 'lucide-react';

export const Login: React.FC = () => {
  const { users } = useStore(); // Get users list to simulate "Fetch"
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('DOCENTE');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate Network Request / Fetch
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isLogin) {
      // Simulate fetching user from DB
      const userData = users.find(u => u.email === email);
      
      if (userData) {
        // ACTION: Update Store directly as requested
        console.log('Usuário logado:', userData);
        store.setUserData(userData);
      } else {
        setError('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
      }
    } else {
       if (!name || !email) {
          setError('Preencha todos os campos obrigatórios.');
          return;
       }
       // Registration Logic
       const success = store.register(name, email, role);
       if (!success) {
          setError('Este e-mail já está cadastrado.');
       } else {
         console.log('Usuário cadastrado e logado:', store.getState().currentUser);
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

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md transform active:scale-95 transition-transform">
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