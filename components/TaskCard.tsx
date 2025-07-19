import { Card, CardContent } from "./ui/card";
import { Task } from "@/store/taskStore";
import { TaskActions } from "./TaskActions";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="mb-2 bg-white dark:bg-gray-700">
      <CardContent className="p-3 flex items-start justify-between">
        <div>
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
  );
}
