"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useBoardStore } from "@/store/boardStore";
import { useTaskStore, Task } from "@/store/taskStore";
import { BoardColumn } from "./BoardColumn";
import { TaskCard } from "./TaskCard";
import { Spinner } from "./Spinner";

type BoardListProps = {
  projectId: string;
};

export function BoardList({ projectId }: BoardListProps) {
  const { boards, loading: boardsLoading, fetchBoards } = useBoardStore();
  const { tasksByBoard, fetchTasks, moveTask } = useTaskStore();

  // State to hold the task that is currently being dragged
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (projectId) {
      fetchBoards(projectId);
    }
  }, [projectId, fetchBoards]);

  useEffect(() => {
    boards.forEach((board) => {
      if (!tasksByBoard[board.id]) {
        fetchTasks(board.id);
      }
    });
  }, [boards, fetchTasks, tasksByBoard]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = Object.values(tasksByBoard)
      .flat()
      .find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // --- START DEBUG LOG ---
    console.log("--- EMPTY BOARD DROP TEST ---");
    console.log("Active (what you dragged):", active);
    console.log("Over (what you dropped on):", over);
    console.log("-----------------------------");
    // --- END DEBUG LOG ---

    setActiveTask(null); // Clear the active task

    if (!over || active.id === over.id) {
      return;
    }

    const sourceBoardId = active.data.current?.boardId;
    if (!sourceBoardId) return;

    const destBoardId = over.data.current?.boardId || (over.id as string);
    const tasksInDestBoard = tasksByBoard[destBoardId] || [];
    let newIndex = tasksInDestBoard.findIndex((t) => t.id === over.id);

    if (newIndex === -1) {
      newIndex = tasksInDestBoard.length;
    }

    moveTask(active.id as string, sourceBoardId, destBoardId, newIndex);
  };

  // 3. Add the loading check
  if (boardsLoading) {
    return <Spinner />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 mt-4 h-fit">
        {boards.map((board) => (
          <BoardColumn
            key={board.id}
            board={board}
            tasks={tasksByBoard[board.id] || []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
