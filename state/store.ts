import { User, ClassRoom, Student, UserRole } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  classes: ClassRoom[];
  students: Student[];
  isAuthenticated: boolean;
}

const INITIAL_STATE: AppState = {
  currentUser: null, // Garante estado inicial nulo para SSR
  isAuthenticated: false,
  users: [
    { id: '1', name: 'Erikson Moreira', email: 'erikson.moreira@gmail.com', role: 'SUPER_ADM' },
    { id: '2', name: 'Prof. Ana', email: 'ana@escola.com', role: 'MESTRE_PLUS' },
    { id: '3', name: 'Prof. Carlos', email: 'carlos@escola.com', role: 'DOCENTE' },
  ],
  classes: [
    { id: 'c1', name: '9º Ano A', year: 2024, subject: 'Matemática' },
    { id: 'c2', name: '3º Ano B', year: 2024, subject: 'Física' },
  ],
  students: [
    { id: 's1', name: 'João Silva', classId: 'c1', grades: [5.5, 6.0], attendance: 85, occurrences: [] },
    { id: 's2', name: 'Maria Souza', classId: 'c1', grades: [9.0, 9.5], attendance: 98, occurrences: [] },
    { id: 's3', name: 'Pedro Santos', classId: 'c2', grades: [4.0, 3.5], attendance: 70, occurrences: [{ id: 'o1', date: '2024-03-10', description: 'Uso de celular em prova', severity: 'GRAVE' }] },
  ]
};

type Listener = (state: AppState) => void;

class PedagogicalStore {
  private state: AppState;
  private listeners: Listener[] = [];
  private readonly STORAGE_KEY = 'saber_pedagogico_state_v2';

  constructor() {
    this.state = INITIAL_STATE;
    // Não carrega automaticamente no construtor para evitar conflito de SSR
    // A hidratação do estado ocorrerá via useEffect no hook useStore ou chamada explícita
  }

  public loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
        this.notify();
      }
    } catch (e) {
      console.error("Error loading state", e);
    }
  }

  private validateSession() {
    if (this.state.currentUser) {
      this.state.isAuthenticated = true;
    } else {
      this.state.isAuthenticated = false;
      this.state.currentUser = null;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    // Emite o estado atual imediatamente ao inscrever
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error("Erro ao salvar no localStorage", e);
      }
    }
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState() {
    return { ...this.state };
  }

  public setUserData(user: User) {
    this.state.currentUser = user;
    this.state.isAuthenticated = true;
    
    const existingIndex = this.state.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.state.users[existingIndex] = user;
    } else {
      this.state.users.push(user);
    }
    
    this.notify();
  }

  public register(name: string, email: string, role: UserRole): boolean {
    if (this.state.users.some(u => u.email === email)) return false;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };

    this.setUserData(newUser);
    return true;
  }

  public logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.state.currentUser = null;
    this.state.isAuthenticated = false;
    this.state = { ...INITIAL_STATE, users: this.state.users }; 
    this.notify();
  }

  public addClass(classData: ClassRoom) {
    this.state.classes = [...this.state.classes, classData];
    this.notify();
  }

  public updateClass(updatedClass: ClassRoom) {
    this.state.classes = this.state.classes.map(c => c.id === updatedClass.id ? updatedClass : c);
    this.notify();
  }

  public deleteClass(id: string) {
    this.state.classes = this.state.classes.filter(c => c.id !== id);
    this.notify();
  }

  public addStudent(student: Student) {
    this.state.students = [...this.state.students, student];
    this.notify();
  }

  public updateStudent(updatedStudent: Student) {
    this.state.students = this.state.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    this.notify();
  }
  
  public deleteStudent(id: string) {
    this.state.students = this.state.students.filter(s => s.id !== id);
    this.notify();
  }
}

export const store = new PedagogicalStore();

import { useState, useEffect } from 'react';

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    // Carrega do storage apenas no cliente após a montagem
    store.loadFromStorage();
    
    const unsubscribe = store.subscribe((newState) => {
      setState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  return state;
}