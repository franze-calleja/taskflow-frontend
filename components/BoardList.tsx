"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskCard } from "./TaskCard";
import { AddTask } from "./AddTask";
import { useTaskStore } from "@/store/taskStore";

type BoardListProps = {
  projectId: string;
};

export function BoardList({ projectId }: BoardListProps) {
  // Get board data from the board store
  const {
    boards,
    loading: boardsLoading,
    error: boardError,
    fetchBoards,
  } = useBoardStore();

  // Get task data from the task store
  const { tasksByBoard, fetchTasks } = useTaskStore();

  // Fetch tasks for each board when the component mounts
  useEffect(() => {
    // Fetch tasks for a board only if they haven't been fetched yet
    boards.forEach((board) => {
      if (!tasksByBoard[board.id]) {
        fetchTasks(board.id);
      }
    });
  }, [projectId, fetchBoards]);

  if (boardsLoading) return <p>Loading boards...</p>;
  if (boardError) return <p className="text-red-500">{boardError}</p>;

  return (
    <div className="flex gap-4 mt-4 h-full">
      {boards.map((board) => (
        <div key={board.id} className="w-72 flex-shrink-0">
          <Card className="bg-gray-100 dark:bg-gray-800 h-full flex flex-col">
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {tasksByBoard[board.id]?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              <AddTask boardId={board.id} />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
