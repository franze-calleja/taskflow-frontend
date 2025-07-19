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
  updateBoard: (boardId: string, newName: string) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useBoardStore = create<BoardState>((set) => ({
  // Initial state
  boards: [],
  loading: false,
  error: null,

  // Action to fetch boards for a specific project
  fetchBoards: async (projectId) => {
    // ADD THIS LOG
    // console.log(`FETCHING BOARDS for projectId: '${projectId}'`);
    
    set({ loading: true, error: null, boards: [] });
    try {
      const url = `${API_URL}/projects/${projectId}/boards`;
      console.log(`Making GET request to: ${url}`); // Also log the URL
      
      const response = await axios.get(url);
      set({ boards: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      set({ error: 'Failed to load boards.', loading: false });
    }
  },

  // Action to create a new board
  addBoard: async (name, projectId) => {
    // console.log('4. Store is sending projectId to backend:', projectId); 
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

  // Action to update a board's name
  updateBoard: async (boardId, newName) => {
    try {
      const response = await axios.patch(`${API_URL}/boards/${boardId}`, { name: newName });
      const updatedBoard = response.data;
      set((state) => ({
        boards: state.boards.map((b) =>
          b.id === boardId ? { ...b, name: updatedBoard.name } : b
        ),
      }));
    } catch (error) {
      console.error('Failed to update board:', error);
    }
  },

  // Action to delete a board
  deleteBoard: async (boardId) => {
    try {
      await axios.delete(`${API_URL}/boards/${boardId}`);
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
      }));
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  },
}));