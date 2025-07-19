import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useProjectStore } from '@/store/ProjectStore';
import { useBoardStore } from '@/store/boardStore';
import { useTaskStore } from '@/store/taskStore';

// This hook encapsulates all Socket.IO logic
export function useSocket(projectId?: string) {
  // We use useRef to hold the socket instance so it persists across re-renders
  const socketRef = useRef<Socket | null>(null);

  // Get the 'fetch' methods from our stores
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const fetchBoards = useBoardStore((state) => state.fetchBoards);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    // Only connect if we have a projectId
    if (!projectId) return;

    // Connect to the backend server
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    // --- EMIT an event to join the project room ---
    socket.emit('joinProject', projectId);

    // --- SETUP LISTENERS for incoming events ---
    
    // Project events (for the main dashboard)
    // For simplicity, we'll just refetch the whole list on any change
    socket.on('project:created', () => fetchProjects("")); // Pass a dummy user ID or handle differently
    socket.on('project:updated', () => fetchProjects(""));
    socket.on('project:deleted', () => fetchProjects(""));

    // Board and Task events (for the specific project board)
    // A simple and reliable way to handle real-time updates is to just refetch
    // the relevant data when an event comes in.
    socket.on('board:created', () => fetchBoards(projectId));
    socket.on('board:updated', () => fetchBoards(projectId));
    socket.on('board:deleted', () => fetchBoards(projectId));

    socket.on('task:created', () => fetchBoards(projectId)); // Refetching boards also refetches tasks
    socket.on('task:updated', () => fetchBoards(projectId));
    socket.on('task:deleted', () => fetchBoards(projectId));
    socket.on('tasks:reordered', () => fetchBoards(projectId));


    // --- CLEANUP ---
    // This function runs when the component unmounts
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };

  }, [projectId, fetchProjects, fetchBoards, fetchTasks]); // Rerun effect if projectId changes

  return socketRef.current;
}