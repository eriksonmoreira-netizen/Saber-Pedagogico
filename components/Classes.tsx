import React, { useState } from 'react';
import { useStore, store } from '../state/store';
import { ClassRoom } from '../types';
import { Modal } from './ui/Modal';
import { Edit2, Trash2, Eye, Plus, Book, Calendar, MoreVertical } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const { classes, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [subject, setSubject] = useState('');

  const openModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass(cls);
      setName(cls.name);
      setYear(cls.year);
      setSubject(cls.subject);
    } else {
      setEditingClass(null);
      setName('');
      setYear(new Date().getFullYear());
      setSubject('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !subject) return;

    if (editingClass) {
      store.updateClass({ ...editingClass, name, year, subject });
    } else {
      store.addClass({
        id: Math.random().toString(36).substr(2, 9),
        name,
        year,
        subject
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      store.deleteClass(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Turmas</h1>
           <p className="text-slate-500 mt-1">Gerencie suas salas de aula, disciplinas e anos letivos.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          <span className="font-semibold">Nova Turma</span>
        </button>
      </div>

      {/* Grid */}
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col">
              
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                    {cls.year}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(cls)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cls.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{cls.name}</h3>
                
                <div className="flex items-center text-slate-500 text-sm mt-3 space-x-2">
                   <Book size={16} className="text-slate-400" />
                   <span>{cls.subject}</span>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-2xl">
                <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm">
                  <Eye size={16} />
                  <span>Detalhes da Turma</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
           <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book size={32} className="text-slate-400" />
           </div>
           <h3 className="text-lg font-semibold text-slate-700">Nenhuma turma cadastrada</h3>
           <p className="text-slate-500 max-w-sm mx-auto mt-2">Comece adicionando uma nova turma para gerenciar seus alunos e diários.</p>
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "Editar Turma" : "Nova Turma"}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Turma</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Ex: 9º Ano A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ano Letivo</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="number" 
                  value={year} 
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Disciplina</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Ex: Matemática"
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md shadow-indigo-200 transition-all">
              {editingClass ? 'Salvar Alterações' : 'Criar Turma'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};