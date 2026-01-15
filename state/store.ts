import { User, ClassRoom, Student, UserRole } from '../types';
import { authService } from '../services/auth';

interface AppState {
  currentUser: User | null;
  users: User[];
  classes: ClassRoom[];
  students: Student[];
  isAuthenticated: boolean;
}

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

class PedagogicalStore {
  private state: AppState;
  private listeners: Listener[] = [];
  private readonly STORAGE_KEY = 'saber_pedagogico_state';

  constructor() {
    this.state = this.loadFromStorage() || INITIAL_STATE;
    this.validateSession();
  }

  // --- Persistence & Observer Pattern ---

  private loadFromStorage(): AppState | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  private validateSession() {
    const savedToken = localStorage.getItem('saber_pedagogico_token');
    if (savedToken) {
      const user = authService.getUserFromToken(savedToken, this.state.users);
      if (user) {
        this.state.currentUser = user;
        this.state.isAuthenticated = true;
      } else {
        this.logout();
      }
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    // Persist state
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    // Notify all listeners
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState() {
    return { ...this.state };
  }

  // --- Actions ---

  public setUserData(user: User) {
    this.state.currentUser = user;
    this.state.users = this.state.users.map(u => u.id === user.id ? user : u);
    this.notify();
  }

  public login(email: string): boolean {
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

  public register(name: string, email: string, role: UserRole): boolean {
    if (this.state.users.some(u => u.email === email)) return false;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };

    this.state.users = [...this.state.users, newUser];
    this.login(email); 
    return true;
  }

  public logout() {
    localStorage.removeItem('saber_pedagogico_token');
    this.state.currentUser = null;
    this.state.isAuthenticated = false;
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

  /**
   * Updates a specific student's grade list
   * @param studentId The ID of the student
   * @param newGrade The new grade to add
   */
  public updateGrade(studentId: string, newGrade: number) {
    const student = this.state.students.find(s => s.id === studentId);
    if (student) {
      const updatedStudent = {
        ...student,
        grades: [...student.grades, newGrade]
      };
      this.updateStudent(updatedStudent);
    }
  }
}

export const store = new PedagogicalStore();

// React Hook for easy store consumption
import { useState, useEffect } from 'react';

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    // Subscribe returns the unsubscribe function, which useEffect will call on unmount
    return store.subscribe((newState) => {
      setState({ ...newState });
    });
  }, []);

  return state;
}