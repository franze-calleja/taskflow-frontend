import {create} from 'zustand';
import axios from 'axios';

// Define the shape of a single project
interface Project {
  id: string;
  name: string;
  authorId: string;
  createdAt: string;
}

// Define the sape of our store's state and actions
interface ProjectState{
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (userId: string) => Promise<void>;
  addProject: (name:string, userId: string) => Promise<void>;
  updateProject: (projectId: string, newName: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;

}

// This is the base URL of our backend API
const API_URL = 'http://localhost:3001/api';

export const useProjectStore = create<ProjectState>((set)=>({
  // Initial state
  projects: [],
  loading: false,
  error: null,

  // Action to fetch projects from the backend
  fetchProjects: async (userId) => {
    set({loading: true, error: null});
    try {
      const response = await axios.get(`${API_URL}/projects/${userId}`);
      set({projects: response.data, loading: false});

    } catch(error){
      console.error('Failed to fetch projects');
      set({error: 'Failed to fetch projects.', loading: false});
    }
  },

  // Action to create new project
  addProject: async (name, userId) => {
    set({loading: true, error: null});
    try{
      const response = await axios.post(`${API_URL}/projects`, {
        name, 
        authorId: userId,
      });
      // Add new project to start of the existing list
      set((state) => ({
        projects: [response.data, ...state.projects],
        loading: false,
      }));
      
    }catch(error){
      console.error('Failed to add project:', error);
      set({error: 'Failed to create project.', loading: false});
    }
  },
  updateProject: async (projectId, newName) => {
    try {
      const response = await axios.patch(`${API_URL}/projects/${projectId}`, {name: newName});
      const updatedProject = response.data;
      set((state) => ({
        projects: state.projects.map((p) => p.id === projectId ? updatedProject : p),
      }))
    } catch (error) {
      console.error('Failed to update project:', error);
      // You can set an error state here to show in the UI
    }
  },
  deleteProject: async (projectId) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }))
    } catch (error) {
      console.error('Failed to delete project:', error);
      // You can set an error state here to show in the UI
      
    }
  }
}))



