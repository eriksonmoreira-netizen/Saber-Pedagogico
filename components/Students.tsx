import React, { useState } from 'react';
import { useStore, store } from '../state/store';
import { Student } from '../types';
import { generateStudentAnalysis } from '../services/gemini';
import { Sparkles, AlertTriangle, TrendingUp, BookOpen, BrainCircuit } from 'lucide-react';
import { Modal } from './ui/Modal';

export const StudentsPage: React.FC = () => {
  const { students, classes, currentUser } = useStore();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const isMestrePlus = currentUser?.role === 'MESTRE_PLUS' || currentUser?.role === 'SUPER_ADM';

  const handleGenerateAnalysis = async (student: Student) => {
    setSelectedStudent(student);
    setIsAnalysisModalOpen(true);
    setAiResult(null); // Reset previous
    
    if (student.aiAnalysis) {
      setAiResult(JSON.parse(student.aiAnalysis));
      return;
    }

    setIsGenerating(true);
    const resultJson = await generateStudentAnalysis(
      student.name, 
      student.grades, 
      student.attendance, 
      student.occurrences.length
    );
    setIsGenerating(false);

    try {
      const parsed = JSON.parse(resultJson);
      setAiResult(parsed);
      // Persist in store
      store.updateStudent({
        ...student,
        aiAnalysis: resultJson
      });
    } catch (e) {
      setAiResult({ prediction: "Erro ao processar dados da IA.", status: "REGULAR" });
    }
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';
  const getAverage = (grades: number[]) => grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '-';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-slate-800">Alunos</h1>
           <p className="text-slate-500">Acompanhamento de desempenho e análise preditiva</p>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Nome</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Turma</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Média</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Frequência</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{student.name}</td>
                <td className="p-4 text-slate-600">{getClassName(student.classId)}</td>
                <td className="p-4">
                  <span className={`font-bold px-2 py-1 rounded-md text-xs ${Number(getAverage(student.grades)) >= 6 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {getAverage(student.grades)}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{student.attendance}%</td>
                <td className="p-4 text-right">
                  {isMestrePlus ? (
                    <button 
                      onClick={() => handleGenerateAnalysis(student)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 rounded-full hover:shadow-lg transition-all"
                    >
                      <Sparkles size={12} />
                      <span>IA Analysis</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Plano Básico</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isAnalysisModalOpen} 
        onClose={() => setIsAnalysisModalOpen(false)}
        title={`Análise Gemini BNCC: ${selectedStudent?.name}`}
      >
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-slate-500 animate-pulse">Consultando BNCC e processando dados...</p>
          </div>
        ) : aiResult ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border-l-4 ${aiResult.status === 'ATENÇÃO' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
              <div className="flex items-center space-x-2 mb-2">
                 {aiResult.status === 'ATENÇÃO' ? <AlertTriangle className="text-red-500" size={20} /> : <TrendingUp className="text-green-500" size={20} />}
                 <h4 className={`font-bold ${aiResult.status === 'ATENÇÃO' ? 'text-red-700' : 'text-green-700'}`}>
                   Status: {aiResult.status}
                 </h4>
              </div>
              <p className="text-sm text-slate-700">{aiResult.prediction}</p>
            </div>

            <div>
              <h5 className="flex items-center text-sm font-semibold text-slate-800 mb-2">
                <BrainCircuit size={16} className="mr-2 text-indigo-500" />
                Destaques & Superação
              </h5>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {aiResult.highlights}
              </p>
            </div>

            <div>
              <h5 className="flex items-center text-sm font-semibold text-slate-800 mb-2">
                <BookOpen size={16} className="mr-2 text-indigo-500" />
                Alinhamento BNCC
              </h5>
              <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                "{aiResult.bnccAlignment}"
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};