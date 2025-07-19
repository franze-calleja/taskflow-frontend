// components/AddBoard.tsx
"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AddBoardProps = {
  projectId: string;
};

export function AddBoard({ projectId }: AddBoardProps) {
  // console.log("3. AddBoard received projectId:", projectId);
  const [name, setName] = useState("");
  const addBoard = useBoardStore((state) => state.addBoard);

  const handleAddBoard = () => {
    if (name.trim()) {
      addBoard(name, projectId);
      setName("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New board name..."
        className="w-60"
      />
      <Button onClick={handleAddBoard}>+ Add Board</Button>
    </div>
  );
}
