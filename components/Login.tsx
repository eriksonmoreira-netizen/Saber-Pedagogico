import React, { useState } from 'react';
import { store, useStore } from '../state/store';
import { UserRole } from '../types';
import { Lock, Mail, User as UserIcon, Briefcase } from 'lucide-react';

export const Login: React.FC = () => {
  const { users } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('DOCENTE');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const userData = users.find(u => u.email === email);
      if (userData) {
        store.setUserData(userData);
      } else {
        setError('Usuário não encontrado.');
      }
    } else {
       const success = store.register(name, email, role);
       if (!success) setError('Este e-mail já está cadastrado.');
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
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Seu nome"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
            {!isLogin && (
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-400" size={20} />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="DOCENTE">Plano Docente</option>
                  <option value="MESTRE">Plano Mestre</option>
                  <option value="MESTRE_PLUS">Plano Mestre Plus</option>
                </select>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Lock size={18} />
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="block w-full text-indigo-600 hover:text-indigo-800 text-sm font-semibold text-center">
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};