import ProjectPageClient from "@/components/pages/ProjectPage";

type Props = {
  params: {
    projectId: string;
  };
};

// Add the 'async' keyword to the function definition
export default async function ProjectPage({ params }: Props) {
  // We can go back to the simpler params access here
  const { projectId } = await params;

  return <ProjectPageClient projectId={projectId} />;
}
