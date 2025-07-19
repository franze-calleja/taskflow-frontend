import { create } from 'zustand';
import axios from 'axios';
// 1. Import the toast function
import { toast } from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  authorId: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (userId: string) => Promise<void>;
  addProject: (name: string, userId: string) => Promise<void>;
  updateProject: (projectId: string, newName: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async (userId) => {
    // ... (fetch logic is the same)
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/projects/${userId}`);
      set({ projects: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ error: 'Failed to load projects.', loading: false });
    }
  },

  addProject: async (name, userId) => {
    const promise = axios.post(`${API_URL}/projects`, { name, authorId: userId });
    
    toast.promise(promise, {
      loading: 'Creating project...',
      success: (response) => {
        set((state) => ({ projects: [response.data, ...state.projects] }));
        return 'Project created successfully!';
      },
      error: 'Failed to create project.',
    });
  },

  updateProject: async (projectId, newName) => {
    const promise = axios.patch(`${API_URL}/projects/${projectId}`, { name: newName });

    toast.promise(promise, {
      loading: 'Updating project...',
      success: (response) => {
        const updatedProject = response.data;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? updatedProject : p
          ),
        }));
        return 'Project updated!';
      },
      error: 'Failed to update project.',
    });
  },

  deleteProject: async (projectId) => {
    const promise = axios.delete(`${API_URL}/projects/${projectId}`);

    toast.promise(promise, {
      loading: 'Deleting project...',
      success: () => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        }));
        return 'Project deleted.';
      },
      error: 'Failed to delete project.',
    });
  },
}));
