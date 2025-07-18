import {create} from 'zustand';
import axios from 'axios';

// Define the shape of a single task
export interface Task{
  id: string;
  title: string;
  description: string | null;
  order: number;
  boardId: string;
}

// Define the shape of our store's state and actions
interface TaskState {
  tasksByBoard: { [boardId: string]: Task[] };
  fetchTasks: (boardId: string) => Promise<void>;
  addTask: (title: string, boardId: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useTaskStore = create<TaskState>((set) => ({
  // Initital state: an object to hold task arrrays, keyed by boardId
  tasksByBoard: {},

  // Action to fetch tasks for a specific board
  fetchTasks: async (boardId) => {
    try {
      const response = await axios.get(`${API_URL}/boards/${boardId}/tasks`);
      set((state) => ({
        tasksByBoard: {
          ...state.tasksByBoard,
          [boardId]: response.data,
        },
      }));
    } catch (error) {
      console.error(`Failed to fetch tasks for board ${boardId}:`, error);
    }
  },
  addTask: async (title, boardId) => {
    try {
      const response = await axios.post(`${API_URL}/boards/${boardId}/tasks`, {
        title,
      });
      const newTask = response.data;
      set((state) => {
        const tasksForBoard = state.tasksByBoard[boardId] || [];
        return {
          tasksByBoard: {
            ...state.tasksByBoard,
            [boardId]: [...tasksForBoard, newTask],
          },
        };
      });
    } catch (error) {
      console.error(`Failed to add task to board ${boardId}:`, error);
    }
  }

}))