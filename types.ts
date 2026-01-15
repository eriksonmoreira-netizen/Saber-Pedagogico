export type UserRole = 'DOCENTE' | 'MESTRE' | 'MESTRE_PLUS' | 'SUPER_ADM';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  grades: number[];
  attendance: number; // Percentage
  occurrences: Occurrence[];
  pdi?: string; // Plano de Desenvolvimento Individual
  aiAnalysis?: string; // Stores the last Gemini analysis
}

export interface ClassRoom {
  id: string;
  name: string;
  year: number;
  subject: string;
}

export interface Occurrence {
  id: string;
  date: string;
  description: string;
  severity: 'LEVE' | 'MEDIA' | 'GRAVE';
}

// Simulating Prisma Model structure
export const PLANS = {
  DOCENTE: { name: 'Plano Docente', price: 29.90, features: ['Turmas', 'Alunos', 'Notas'] },
  MESTRE: { name: 'Plano Mestre', price: 59.90, features: ['Ocorrências', 'Tutorias', 'PDI'] },
  MESTRE_PLUS: { name: 'Plano Mestre Plus', price: 89.90, features: ['IA Gemini BNCC', 'Análise Preditiva'] },
};