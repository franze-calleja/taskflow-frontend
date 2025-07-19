"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BoardList } from "@/components/BoardList";
import { AddBoard } from "@/components/AddBoard";
// 1. Import the new hook
import { useSocket } from "@/hooks/useSocket";

type ProjectPageClientProps = {
  projectId: string;
};

export default function ProjectPageClient({
  projectId,
}: ProjectPageClientProps) {
  // 2. Call the hook to establish the real-time connection for this project
  useSocket(projectId);

  return (
    <div className="p-4 md:p-8 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Project Board</h1>
        </div>
        <div className="flex items-center gap-4">
          <AddBoard projectId={projectId} />
          <Button asChild variant="outline">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow overflow-x-auto">
        <BoardList projectId={projectId} />
      </main>
    </div>
  );
}
