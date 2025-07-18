import ProjectPageClient from "@/components/pages/ProjectPage"; // Assuming this is the path

// This page component automatically receives `params` from Next.js
type Props = {
  params: {
    projectId: string;
  };
};

export default function ProjectPage({ params }: Props) {
  // Simply render your custom component and pass the params down to it
  return <ProjectPageClient params={params} />;
}
