import React from 'react';
import { useStore } from '../state/store';
import { Users, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { students, classes, currentUser } = useStore();

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalOccurrences = students.reduce((acc, s) => acc + s.occurrences.length, 0);
  
  // Mock data for chart
  const data = [
    { name: '9º A', media: 7.5 },
    { name: '3º B', media: 6.2 },
    { name: '1º C', media: 8.0 },
    { name: '2º A', media: 5.8 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bem-vindo, {currentUser?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Aqui está o resumo pedagógico de hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total de Alunos" value={totalStudents} color="bg-blue-500" />
        <StatCard icon={BookOpen} title="Turmas Ativas" value={totalClasses} color="bg-emerald-500" />
        <StatCard icon={AlertCircle} title="Ocorrências" value={totalOccurrences} color="bg-amber-500" />
        <StatCard icon={TrendingUp} title="Média Geral" value="7.2" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho por Turma</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="media" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Avisos Recentes</h3>
           <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="text-red-500 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Reunião Pedagógica</h4>
                  <p className="text-xs text-red-600">Amanhã às 14:00 na sala dos professores.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <TrendingUp className="text-blue-500 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-bold text-blue-800">Fechamento de Notas</h4>
                  <p className="text-xs text-blue-600">O sistema estará aberto até sexta-feira.</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};