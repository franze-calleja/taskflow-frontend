import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BoardList } from "@/components/BoardList";
import { AddBoard } from "@/components/AddBoard";

// The props for this page will include the dynamic params from the URL
type ProjectPageClientProps = {
  projectId: string;
};

export default function ProjectPageClient({
  projectId,
}: ProjectPageClientProps) {
  // console.log("1. ProjectPageClient received projectId:", projectId);
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          {/* We can fetch and display the project name here later */}
          <h1 className="text-3xl font-bold">Project Board</h1>
          <p className="text-gray-500">Project ID: {projectId}</p>
        </div>
        <div>
          <AddBoard projectId={projectId} />
          <Button asChild variant="outline">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </header>
      <main>
        <BoardList projectId={projectId} />
      </main>
    </div>
  );
}
