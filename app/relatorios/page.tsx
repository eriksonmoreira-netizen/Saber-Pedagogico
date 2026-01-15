'use client';

import React from 'react';
import { useStore } from '../../state/store';
import { FileText, Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  const { students, classes, currentUser } = useStore();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório Escolar', 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [['Aluno', 'Média', 'Freq.']],
      body: students.map(s => [s.name, s.grades[0] || 0, `${s.attendance}%`]),
    });
    doc.save('relatorio.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
        <button onClick={generatePDF} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
           <Download size={18} /><span>PDF</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-slate-500">Selecione os filtros para exportar os dados.</p>
      </div>
    </div>
  );
}