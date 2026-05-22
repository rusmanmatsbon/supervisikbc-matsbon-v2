"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, SupervisionSession, AssessmentScore, UserRole } from './types';
import { SAMPLE_USERS } from './types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Users
  users: User[];
  
  // Supervisions
  supervisions: SupervisionSession[];
  assessmentScores: Record<string, AssessmentScore[]>; // session_id -> scores
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // User management
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Supervision management
  addSupervision: (supervision: Omit<SupervisionSession, 'id'>) => string;
  updateSupervision: (id: string, data: Partial<SupervisionSession>) => void;
  deleteSupervision: (id: string) => void;
  
  // Assessment
  saveAssessmentScores: (sessionId: string, scores: AssessmentScore[]) => void;
  getAssessmentScores: (sessionId: string) => AssessmentScore[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      users: SAMPLE_USERS,
      supervisions: [],
      assessmentScores: {},

      login: (email: string, password: string) => {
        // Simple demo authentication - in production, use proper auth
        const user = get().users.find(u => u.email === email);
        if (user && password === 'demo123') {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          createdAt: new Date(),
        };
        set(state => ({ users: [...state.users, newUser] }));
      },

      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
        }));
      },

      deleteUser: (id) => {
        set(state => ({
          users: state.users.filter(u => u.id !== id)
        }));
      },

      addSupervision: (supervisionData) => {
        const id = `sup_${Date.now()}`;
        const newSupervision: SupervisionSession = {
          ...supervisionData,
          id,
        };
        set(state => ({
          supervisions: [...state.supervisions, newSupervision]
        }));
        return id;
      },

      updateSupervision: (id, data) => {
        set(state => ({
          supervisions: state.supervisions.map(s => 
            s.id === id ? { ...s, ...data } : s
          )
        }));
      },

      deleteSupervision: (id) => {
        set(state => ({
          supervisions: state.supervisions.filter(s => s.id !== id),
          assessmentScores: Object.fromEntries(
            Object.entries(state.assessmentScores).filter(([key]) => key !== id)
          )
        }));
      },

      saveAssessmentScores: (sessionId, scores) => {
        set(state => ({
          assessmentScores: {
            ...state.assessmentScores,
            [sessionId]: scores
          }
        }));
      },

      getAssessmentScores: (sessionId) => {
        return get().assessmentScores[sessionId] || [];
      },
    }),
    {
      name: 'supervisi-madrasah-storage',
    }
  )
);

// Helper function to check permissions
export function canSupervise(role: UserRole): boolean {
  return ['admin', 'waka_kurikulum', 'kepala_madrasah', 'pengawas'].includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return ['admin'].includes(role);
}

export function canViewAllReports(role: UserRole): boolean {
  return ['admin', 'waka_kurikulum', 'kepala_madrasah', 'pengawas'].includes(role);
}
