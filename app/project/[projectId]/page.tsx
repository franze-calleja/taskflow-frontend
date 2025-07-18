import ProjectPage from "@/components/pages/ProjectPage";
import React from "react";

// This page component automatically receives `params` from Next.js
type Props = {
  params: {
    projectId: string;
  };
};

const page = ({ params }: Props) => {
  return (
    <div>
      <ProjectPage params={params} />
    </div>
  );
};

export default page;
