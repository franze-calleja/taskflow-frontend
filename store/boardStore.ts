import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Board {
  id: string;
  name: string;
  order: number;
  projectId: string;
}

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
  boards: [],
  loading: false,
  error: null,
  fetchBoards: async (projectId) => {
    set({ loading: true, error: null, boards: [] });
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/boards`);
      set({ boards: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      set({ error: 'Failed to load boards.', loading: false });
    }
  },

  addBoard: async (name, projectId) => {
    const promise = axios.post(`${API_URL}/projects/${projectId}/boards`, { name });

    toast.promise(promise, {
      loading: 'Adding board...',
      success: (response) => {
        set((state) => ({ boards: [...state.boards, response.data] }));
        return 'Board added!';
      },
      error: 'Failed to add board.',
    });
  },

  updateBoard: async (boardId, newName) => {
    const promise = axios.patch(`${API_URL}/boards/${boardId}`, { name: newName });

    toast.promise(promise, {
      loading: 'Updating board...',
      success: (response) => {
        const updatedBoard = response.data;
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, name: updatedBoard.name } : b
          ),
        }));
        return 'Board updated!';
      },
      error: 'Failed to update board.',
    });
  },

  deleteBoard: async (boardId) => {
    const promise = axios.delete(`${API_URL}/boards/${boardId}`);

    toast.promise(promise, {
      loading: 'Deleting board...',
      success: () => {
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== boardId),
        }));
        return 'Board deleted.';
      },
      error: 'Failed to delete board.',
    });
  },
}));
