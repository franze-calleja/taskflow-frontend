"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AddTaskProps = {
  boardId: string;
};

export function AddTask({ boardId }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = () => {
    if (title.trim()) {
      addTask(title, boardId);
      setTitle("");
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task title..."
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <Button onClick={handleAddTask} size="sm">
        Add
      </Button>
    </div>
  );
}
