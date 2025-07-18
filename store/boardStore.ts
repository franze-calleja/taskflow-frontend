import { create } from 'zustand';
import axios from 'axios';

// Define the shape of a single board
interface Board {
  id: string;
  name: string;
  order: number;
  projectId: string;
}

// Define the shape of our store's state and actions
interface BoardState {
  boards: Board[];
  loading: boolean;
  error: string | null;
  fetchBoards: (projectId: string) => Promise<void>;
  addBoard: (name: string, projectId: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useBoardStore = create<BoardState>((set) => ({
  // Initial state
  boards: [],
  loading: false,
  error: null,

  // Action to fetch boards for a specific project
  fetchBoards: async (projectId) => {
    set({ loading: true, error: null, boards: [] }); // Reset boards on new fetch
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/boards`);
      set({ boards: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      set({ error: 'Failed to load boards.', loading: false });
    }
  },

  // Action to create a new board
  addBoard: async (name, projectId) => {
    // We don't set loading here to provide a faster UI response
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/boards`, {
        name,
      });
      // Add the new board to the end of the existing list
      set((state) => ({
        boards: [...state.boards, response.data],
      }));
    } catch (error) {
      console.error('Failed to add board:', error);
      // Optionally handle the error in the UI, e.g., show a toast notification
      set({ error: 'Failed to create board.' });
    }
  },
}));