'use client';

import React from 'react';
import { useStore } from '../state/store';
import { Users, BookOpen, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const StatCard = ({ icon: Icon, title, value, color, description }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color} shadow-sm`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{value}</h3>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { students, classes, currentUser } = useStore();

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalOccurrences = students.reduce((acc, s) => acc + s.occurrences.length, 0);
  
  const allGrades = students.flatMap(s => s.grades);
  const averageGrade = allGrades.length 
    ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1) 
    : '0.0';

  const chartData = classes.map(cls => {
    const classStudents = students.filter(s => s.classId === cls.id);
    const classGrades = classStudents.flatMap(s => s.grades);
    const avg = classGrades.length 
      ? (classGrades.reduce((a, b) => a + b, 0) / classGrades.length).toFixed(1)
      : 0;
    
    return {
      name: cls.name,
      media: Number(avg)
    };
  });

  const firstName = currentUser?.name.split(' ')[0];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Olá, {firstName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Aqui está o panorama da sua gestão escolar hoje.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total de Alunos" value={totalStudents} color="bg-blue-500" description="Alunos matriculados" />
        <StatCard icon={BookOpen} title="Turmas Ativas" value={totalClasses} color="bg-emerald-500" description="Salas gerenciadas" />
        <StatCard icon={AlertCircle} title="Ocorrências" value={totalOccurrences} color="bg-amber-500" description="Registradas este mês" />
        <StatCard icon={TrendingUp} title="Média Geral" value={averageGrade} color="bg-indigo-500" description="Desempenho global" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Desempenho por Turma</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 10]} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="media" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={100} />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Inteligência Artificial BNCC</h3>
              <p className="text-indigo-100 text-sm mb-4 relative z-10">
                Gere planos de aula e análises preditivas em segundos.
              </p>
              <Link href="/alunos" className="block text-center bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-50 transition-colors relative z-10 w-full">
                Acessar Ferramentas
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}