import { create } from 'zustand';
import axios from 'axios';

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
  // Add the new action for moving tasks
  moveTask: (taskId: string, sourceBoardId: string, destBoardId: string, newIndex: number) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasksByBoard: {},

  // fetchTasks, addTask, updateTask, deleteTask remain the same...
  fetchTasks: async (boardId) => {
    try {
      const response = await axios.get(`${API_URL}/boards/${boardId}/tasks`);
      set((state) => ({
        tasksByBoard: { ...state.tasksByBoard, [boardId]: response.data },
      }));
    } catch (error) { console.error(`Failed to fetch tasks for board ${boardId}:`, error); }
  },
  addTask: async (title, boardId) => {
    try {
      const response = await axios.post(`${API_URL}/boards/${boardId}/tasks`, { title });
      set((state) => ({
        tasksByBoard: { ...state.tasksByBoard, [boardId]: [...(state.tasksByBoard[boardId] || []), response.data] },
      }));
    } catch (error) { console.error(`Failed to add task to board ${boardId}:`, error); }
  },
  updateTask: async (taskId, boardId, data) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, data);
      set((state) => ({
        tasksByBoard: { ...state.tasksByBoard, [boardId]: state.tasksByBoard[boardId].map(t => t.id === taskId ? response.data : t) },
      }));
    } catch (error) { console.error(`Failed to update task ${taskId}:`, error); }
  },
  deleteTask: async (taskId, boardId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      set((state) => ({
        tasksByBoard: { ...state.tasksByBoard, [boardId]: state.tasksByBoard[boardId].filter(t => t.id !== taskId) },
      }));
    } catch (error) { console.error(`Failed to delete task ${taskId}:`, error); }
  },

  // --- NEW DRAG-AND-DROP ACTION ---
  moveTask: async (taskId, sourceBoardId, destBoardId, newIndex) => {
    // 1. Find the task being moved
    const taskToMove = get().tasksByBoard[sourceBoardId]?.find(t => t.id === taskId);
    if (!taskToMove) return;

    // 2. Optimistic UI Update: Move the task in the local state immediately
    set(state => {
      const newTasksByBoard = { ...state.tasksByBoard };
      
      // Remove task from the source board
      const sourceTasks = newTasksByBoard[sourceBoardId].filter(t => t.id !== taskId);
      newTasksByBoard[sourceBoardId] = sourceTasks;

      // Add task to the destination board at the correct index
      const destTasks = [...(newTasksByBoard[destBoardId] || [])];
      destTasks.splice(newIndex, 0, { ...taskToMove, boardId: destBoardId });
      newTasksByBoard[destBoardId] = destTasks;

      return { tasksByBoard: newTasksByBoard };
    });

    // --- START DEBUG LOG 2 ---
    const finalDestTasks = get().tasksByBoard[destBoardId];
    console.log('--- SENDING TO BACKEND ---');
    console.log('Destination Board ID:', destBoardId);
    // Use JSON.stringify for a clean, readable view of the array
    console.log('Payload (orderedTasks):', JSON.stringify(finalDestTasks, null, 2));
    console.log('--------------------------');
    // --- END DEBUG LOG 2 ---

    // 3. API Call: Update the backend in the background
    try {
      const finalDestTasks = get().tasksByBoard[destBoardId];
      
      // Change this line from axios.patch to axios.post
      await axios.post(`${API_URL}/tasks/reorder`, {
        boardId: destBoardId,
        orderedTasks: finalDestTasks,
      });

      if (sourceBoardId !== destBoardId) {
        const finalSourceTasks = get().tasksByBoard[sourceBoardId];
        // And change this one too
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
