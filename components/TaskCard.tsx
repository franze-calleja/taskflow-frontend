"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "./ui/card";
import { Task } from "@/store/taskStore";
import { TaskActions } from "./TaskActions";
// 1. Import the drag handle icon
import { GripVertical } from "lucide-react";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { boardId: task.boardId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    // The setNodeRef now goes on the main container div
    <div ref={setNodeRef} style={style}>
      <Card className="mb-2 bg-white dark:bg-gray-700">
        <CardContent className="p-2 flex items-center justify-between gap-2">
          {/* 2. Create a specific element for the drag handle */}
          {/* The dnd-kit listeners now ONLY apply to this div */}
          <div
            className="p-1 cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex-grow">
            <p className="font-medium">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}
          </div>
          <TaskActions task={task} />
        </CardContent>
      </Card>
    </div>
  );
}
