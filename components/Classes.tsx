import React, { useState } from 'react';
import { useStore, store } from '../state/store';
import { ClassRoom } from '../types';
import { Modal } from './ui/Modal';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';

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

  const canEdit = currentUser?.role !== 'DOCENTE'; // Example restriction, strictly Docente might only view or basic edit

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Gestão de Turmas</h1>
           <p className="text-slate-500">Gerencie suas salas de aula e disciplinas</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>Nova Turma</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{cls.name}</h3>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{cls.year}</span>
              </div>
              <div className="flex space-x-1">
                 <button onClick={() => openModal(cls)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit2 size={18} />
                 </button>
                 <button onClick={() => handleDelete(cls.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-4">Disciplina: <span className="font-medium">{cls.subject}</span></p>
            <button className="w-full mt-2 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
               <Eye size={16} />
               <span>Ver Detalhes</span>
            </button>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "Editar Turma" : "Nova Turma"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Turma</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ex: 9º Ano A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ano Letivo</label>
            <input 
              type="number" 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Disciplina</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ex: Matemática"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};