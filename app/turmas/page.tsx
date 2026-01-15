'use client';

import React, { useState } from 'react';
import { useStore, store } from '../../state/store';
import { ClassRoom } from '../../types';
import { ClassModal } from '../../components/ClassModal';
import { Edit2, Trash2, Eye, Plus, Book, GraduationCap } from 'lucide-react';

export default function ClassesPage() {
  const { classes, students } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const openModal = (cls?: ClassRoom) => {
    setEditingClass(cls || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      store.deleteClass(id);
    }
  };

  const getStudentCount = (classId: string) => {
    return students.filter(s => s.classId === classId).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Turmas</h1>
           <p className="text-slate-500 mt-1">Organize suas salas de aula.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span className="font-semibold">Nova Turma</span>
        </button>
      </div>

      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-100">
                    {cls.year}
                  </div>
                  <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-slate-100 flex items-center gap-1">
                    <GraduationCap size={14} />
                    {getStudentCount(cls.id)} Alunos
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{cls.name}</h3>
                <div className="flex items-center text-slate-500 text-sm space-x-2">
                   <Book size={16} className="text-slate-400" />
                   <span className="truncate">{cls.subject}</span>
                </div>
              </div>
              <div className="mt-auto border-t border-slate-100 bg-slate-50/50 p-3 grid grid-cols-3 gap-2">
                 <button className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600 transition-all">
                    <Eye size={18} />
                    <span className="text-[10px] font-medium mt-1">Detalhes</span>
                 </button>
                 <button onClick={() => openModal(cls)} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white text-slate-500 hover:text-amber-600 transition-all">
                    <Edit2 size={18} />
                    <span className="text-[10px] font-medium mt-1">Editar</span>
                 </button>
                 <button onClick={() => handleDelete(cls.id)} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white text-slate-500 hover:text-red-600 transition-all">
                    <Trash2 size={18} />
                    <span className="text-[10px] font-medium mt-1">Excluir</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <h3 className="text-xl font-bold text-slate-700">Nenhuma turma encontrada</h3>
        </div>
      )}

      <ClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editingClass={editingClass} />
    </div>
  );
}