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
  updateTask: (taskId: string, boardId: string, data: { title?: string; description?: string }) => Promise<void>;
  deleteTask: (taskId: string, boardId: string) => Promise<void>;
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
  },

  updateTask: async (taskId, boardId, data) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, data);
      const updatedTask = response.data;
      set((state) => {
        const tasksForBoard = state.tasksByBoard[boardId].map((task) =>
          task.id === taskId ? updatedTask : task
        );
        return {
          tasksByBoard: {
            ...state.tasksByBoard,
            [boardId]: tasksForBoard,
          },
        };
      });
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
    }
  },

  deleteTask: async (taskId, boardId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      set((state) => {
        const tasksForBoard = state.tasksByBoard[boardId].filter(
          (task) => task.id !== taskId
        );
        return {
          tasksByBoard: {
            ...state.tasksByBoard,
            [boardId]: tasksForBoard,
          },
        };
      });
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
    }
  },

}))