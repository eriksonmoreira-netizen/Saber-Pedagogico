import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { ClassRoom } from '../types';
import { store } from '../state/store';
import { Calendar, Book, Type } from 'lucide-react';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClass: ClassRoom | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, editingClass }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (editingClass) {
      setName(editingClass.name);
      setYear(editingClass.year);
      setSubject(editingClass.subject);
    } else {
      setName('');
      setYear(new Date().getFullYear());
      setSubject('');
    }
  }, [editingClass, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) return;

    if (editingClass) {
      store.updateClass({
        ...editingClass,
        name,
        year,
        subject
      });
    } else {
      store.addClass({
        id: Math.random().toString(36).substr(2, 9),
        name,
        year,
        subject
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingClass ? "Editar Turma" : "Nova Turma"}
    >
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Turma</label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ano</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Disciplina</label>
            <div className="relative">
              <Book className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
        </div>
        <div className="pt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};