import Link from "next/link";
import { Button } from "../ui/button";

// The props for this page will include the dynamic params from the URL
type ProjectPageClientProps = {
  params: {
    projectId: string;
  };
};

export default function ProjectPageClient({ params }: ProjectPageClientProps) {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Project Board</h1>
          <p className="text-gray-500">Project ID: {params.projectId}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">← Back to Dashboard</Link>
        </Button>
      </header>
      <main>
        <p>Boards will be displayed here.</p>
      </main>
    </div>
  );
}
