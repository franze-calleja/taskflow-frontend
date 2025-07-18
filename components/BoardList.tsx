"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { Card, CardHeader, CardTitle } from "./ui/card";

type BoardListProps = {
  projectId: string;
};

export function BoardList({ projectId }: BoardListProps) {
  const { boards, loading, error, fetchBoards } = useBoardStore();

  useEffect(() => {
    // When the component mounts, fetch the boards for this project
    fetchBoards(projectId);
  }, [projectId, fetchBoards]);

  if (loading) return <p>Loading boards...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex gap-4 mt-8 overflow-x-auto pb-4">
      {boards.map((board) => (
        <div key={board.id} className="w-72 flex-shrink-0">
          <Card className="bg-gray-100 dark:bg-gray-800">
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
            {/* We will add tasks here later */}
          </Card>
        </div>
      ))}
    </div>
  );
}
