import React, { useState } from 'react';
import { useStore } from '../state/store';
import { FileText, Download, Filter } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const ReportsPage: React.FC = () => {
  const { students, classes, currentUser } = useStore();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    // In a real app, plan filtering might filter students based on their paying status or the teacher's plan
    // Here we just simulate filtering.
    return matchesClass;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Desempenho Escolar', 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado por: ${currentUser?.name}`, 14, 30);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableData = filteredStudents.map(s => {
      const cls = classes.find(c => c.id === s.classId);
      const avg = (s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1)).toFixed(1);
      return [s.name, cls?.name || 'N/A', `${s.attendance}%`, avg, s.occurrences.length];
    });

    autoTable(doc, {
      startY: 44,
      head: [['Aluno', 'Turma', 'Freq.', 'Média', 'Ocorrências']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    });

    doc.save('relatorio-saber-pedagogico.pdf');
  };

  const generateCSV = () => {
    const headers = ['Nome,Turma,Frequencia,Media,Ocorrencias'];
    const rows = filteredStudents.map(s => {
      const cls = classes.find(c => c.id === s.classId);
      const avg = (s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1)).toFixed(1);
      return `${s.name},${cls?.name || 'N/A'},${s.attendance}%,${avg},${s.occurrences.length}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio-saber-pedagogico.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Central de Relatórios</h1>
          <p className="text-slate-500">Exporte dados detalhados para análise</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full md:w-64">
             <label className="block text-sm font-medium text-slate-700 mb-1">Filtrar por Turma</label>
             <div className="relative">
               <select 
                 value={selectedClass}
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="w-full appearance-none pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
               >
                 <option value="all">Todas as Turmas</option>
                 {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="flex space-x-3 ml-auto">
             <button 
               onClick={generateCSV}
               className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
             >
               <FileText size={18} />
               <span>CSV</span>
             </button>
             <button 
               onClick={generatePDF}
               className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
             >
               <Download size={18} />
               <span>PDF</span>
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Aluno</th>
                <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Turma</th>
                <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Frequência</th>
                <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Média</th>
                <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Ocorrências</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => {
                   const cls = classes.find(c => c.id === s.classId);
                   const avg = (s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1)).toFixed(1);
                   return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 text-sm font-medium text-slate-800">{s.name}</td>
                      <td className="p-3 text-sm text-slate-600">{cls?.name || 'N/A'}</td>
                      <td className="p-3 text-sm text-slate-600">{s.attendance}%</td>
                      <td className="p-3 text-sm">
                         <span className={`font-bold px-2 py-0.5 rounded text-xs ${Number(avg) >= 6 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {avg}
                         </span>
                      </td>
                      <td className="p-3 text-sm text-slate-600">{s.occurrences.length}</td>
                    </tr>
                   );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Nenhum aluno encontrado com os filtros selecionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};