import { User, ClassRoom, Student, UserRole } from '../types';
import { authService } from '../services/auth';

interface AppState {
  currentUser: User | null;
  users: User[];
  classes: ClassRoom[];
  students: Student[];
  isAuthenticated: boolean;
}

// Initial Mock Data
const INITIAL_STATE: AppState = {
  currentUser: null,
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

class Store {
  private state: AppState;
  private listeners: Listener[] = [];

  constructor() {
    // Attempt to restore session from localStorage token
    const savedState = localStorage.getItem('saber_pedagogico_state');
    const savedToken = localStorage.getItem('saber_pedagogico_token');
    
    let loadedState = savedState ? JSON.parse(savedState) : INITIAL_STATE;

    // Validate Token if exists
    if (savedToken) {
       const user = authService.getUserFromToken(savedToken, loadedState.users);
       if (user) {
         loadedState.currentUser = user;
         loadedState.isAuthenticated = true;
       } else {
         // Token invalid or expired
         localStorage.removeItem('saber_pedagogico_token');
         loadedState.currentUser = null;
         loadedState.isAuthenticated = false;
       }
    }

    this.state = loadedState;
  }

  public getState() {
    return this.state;
  }

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    // We persist state (data) separately from token (auth) usually, but here we sync simple data
    // We exclude currentUser from the state string to rely on token for auth source of truth,
    // but for this simple app, we just save the bulk state and token separately.
    localStorage.setItem('saber_pedagogico_state', JSON.stringify(this.state));
    this.listeners.forEach(listener => listener(this.state));
  }

  // --- Actions ---

  public login(email: string) {
    const user = this.state.users.find(u => u.email === email);
    if (user) {
      const token = authService.createToken(user);
      localStorage.setItem('saber_pedagogico_token', token);
      
      this.state.currentUser = user;
      this.state.isAuthenticated = true;
      this.notify();
      return true;
    }
    return false;
  }

  public register(name: string, email: string, role: UserRole) {
    if (this.state.users.some(u => u.email === email)) {
      return false; // Email already exists
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };

    this.state.users = [...this.state.users, newUser];
    
    // Auto login
    const token = authService.createToken(newUser);
    localStorage.setItem('saber_pedagogico_token', token);
    
    this.state.currentUser = newUser;
    this.state.isAuthenticated = true;
    this.notify();
    
    return true;
  }

  public logout() {
    localStorage.removeItem('saber_pedagogico_token');
    this.state.currentUser = null;
    this.state.isAuthenticated = false;
    this.notify();
  }

  public addClass(newClass: ClassRoom) {
    this.state.classes = [...this.state.classes, newClass];
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

  public updateStudent(updatedStudent: Student) {
    this.state.students = this.state.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    this.notify();
  }

  public addStudent(student: Student) {
    this.state.students = [...this.state.students, student];
    this.notify();
  }
  
  public deleteStudent(id: string) {
    this.state.students = this.state.students.filter(s => s.id !== id);
    this.notify();
  }
}

export const store = new Store();

// React Hook for using store
import { useState, useEffect } from 'react';

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(newState => setState({ ...newState }));
  }, []);

  return state;
}