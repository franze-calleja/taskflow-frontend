import { Card, CardContent } from "./ui/card";
import { Task } from "@/store/taskStore";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="mb-2 bg-white dark:bg-gray-700">
      <CardContent className="p-3">
        <p>{task.title}</p>
      </CardContent>
    </Card>
  );
}
