"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskCard } from "./TaskCard";
import { AddTask } from "./AddTask";
import { BoardActions } from "./BoardActions";

type BoardListProps = {
  projectId: string;
};

export function BoardList({ projectId }: BoardListProps) {
  const {
    boards,
    loading: boardsLoading,
    error: boardError,
    fetchBoards,
  } = useBoardStore();
  const { tasksByBoard, fetchTasks } = useTaskStore();

  // --- THIS IS THE FIX ---
  useEffect(() => {
    // Add a check to make sure projectId is available before fetching
    if (projectId) {
      fetchBoards(projectId);
    }
  }, [projectId, fetchBoards]); // The dependency array is correct

  useEffect(() => {
    // This part is for fetching tasks and can remain the same
    boards.forEach((board) => {
      if (!tasksByBoard[board.id]) {
        fetchTasks(board.id);
      }
    });
  }, [boards, fetchTasks, tasksByBoard]);

  if (boardsLoading) return <p>Loading boards...</p>;
  if (boardError) return <p className="text-red-500">{boardError}</p>;

  return (
    <div className="flex gap-4 mt-4 h-full">
      {boards.map((board) => (
        <div key={board.id} className="w-72 flex-shrink-0">
          <Card className="bg-gray-100 dark:bg-gray-800 h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{board.name}</CardTitle>
              <BoardActions boardId={board.id} currentName={board.name} />
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
