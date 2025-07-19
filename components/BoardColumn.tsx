"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskCard } from "./TaskCard";
import { AddTask } from "./AddTask";
import { BoardActions } from "./BoardActions";
import { Task } from "@/store/taskStore";

type BoardColumnProps = {
  board: { id: string; name: string };
  tasks: Task[];
};

export function BoardColumn({ board, tasks }: BoardColumnProps) {
  // This hook makes the entire component a droppable area
  const { setNodeRef } = useDroppable({ id: board.id });

  return (
    <div ref={setNodeRef} className="w-72 flex-shrink-0">
      <Card className="bg-gray-100 dark:bg-gray-800 h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{board.name}</CardTitle>
          <BoardActions boardId={board.id} currentName={board.name} />
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
          <AddTask boardId={board.id} />
        </CardContent>
      </Card>
    </div>
  );
}
