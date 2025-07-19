import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  order: number;
  boardId: string;
}

interface TaskState {
  tasksByBoard: { [boardId: string]: Task[] };
  fetchTasks: (boardId: string) => Promise<void>;
  addTask: (title: string, boardId: string) => Promise<void>;
  updateTask: (taskId: string, boardId: string, data: { title?: string; description?: string }) => Promise<void>;
  deleteTask: (taskId: string, boardId: string) => Promise<void>;
  moveTask: (taskId: string, sourceBoardId: string, destBoardId: string, newIndex: number) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasksByBoard: {},
  fetchTasks: async (boardId) => {
    try {
      const response = await axios.get(`${API_URL}/boards/${boardId}/tasks`);
      set((state) => ({
        tasksByBoard: { ...state.tasksByBoard, [boardId]: response.data },
      }));
    } catch (error) { console.error(`Failed to fetch tasks for board ${boardId}:`, error); }
  },

  addTask: async (title, boardId) => {
    const promise = axios.post(`${API_URL}/boards/${boardId}/tasks`, { title });

    toast.promise(promise, {
      loading: 'Adding task...',
      success: (response) => {
        const newTask = response.data;
        set((state) => {
          const tasksForBoard = state.tasksByBoard[boardId] || [];
          return {
            tasksByBoard: { ...state.tasksByBoard, [boardId]: [...tasksForBoard, newTask] },
          };
        });
        return 'Task added!';
      },
      error: 'Failed to add task.',
    });
  },

  updateTask: async (taskId, boardId, data) => {
    const promise = axios.patch(`${API_URL}/tasks/${taskId}`, data);

    toast.promise(promise, {
      loading: 'Updating task...',
      success: (response) => {
        const updatedTask = response.data;
        set((state) => {
          const tasksForBoard = state.tasksByBoard[boardId].map((task) =>
            task.id === taskId ? updatedTask : task
          );
          return {
            tasksByBoard: { ...state.tasksByBoard, [boardId]: tasksForBoard },
          };
        });
        return 'Task updated!';
      },
      error: 'Failed to update task.',
    });
  },

  deleteTask: async (taskId, boardId) => {
    const promise = axios.delete(`${API_URL}/tasks/${taskId}`);

    toast.promise(promise, {
      loading: 'Deleting task...',
      success: () => {
        set((state) => {
          const tasksForBoard = state.tasksByBoard[boardId].filter(
            (task) => task.id !== taskId
          );
          return {
            tasksByBoard: { ...state.tasksByBoard, [boardId]: tasksForBoard },
          };
        });
        return 'Task deleted.';
      },
      error: 'Failed to delete task.',
    });
  },

  moveTask: async (taskId, sourceBoardId, destBoardId, newIndex) => {
    // ... (moveTask logic remains the same, without toasts for now)
    const taskToMove = get().tasksByBoard[sourceBoardId]?.find(t => t.id === taskId);
    if (!taskToMove) return;
    set(state => {
      const newTasksByBoard = { ...state.tasksByBoard };
      const sourceTasks = newTasksByBoard[sourceBoardId].filter(t => t.id !== taskId);
      newTasksByBoard[sourceBoardId] = sourceTasks;
      const destTasks = [...(newTasksByBoard[destBoardId] || [])];
      destTasks.splice(newIndex, 0, { ...taskToMove, boardId: destBoardId });
      newTasksByBoard[destBoardId] = destTasks;
      return { tasksByBoard: newTasksByBoard };
    });
    try {
      const finalDestTasks = get().tasksByBoard[destBoardId];
      await axios.post(`${API_URL}/tasks/reorder`, {
        boardId: destBoardId,
        orderedTasks: finalDestTasks,
      });
      if (sourceBoardId !== destBoardId) {
        const finalSourceTasks = get().tasksByBoard[sourceBoardId];
        await axios.post(`${API_URL}/tasks/reorder`, {
          boardId: sourceBoardId,
          orderedTasks: finalSourceTasks,
        });
      }
    } catch (error) {
      console.error('Failed to reorder tasks on the server:', error);
    }
  },
}));