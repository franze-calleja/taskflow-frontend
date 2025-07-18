"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectStore } from "@/store/ProjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ProjectActions } from "./ProjectActions";

export function ProjectList() {
  const { data: session } = useSession();
  const { projects, loading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    // Fetch projects only is the user session is available
    if (session?.user?.id) {
      fetchProjects(session.user.id);
    }
  }, [session, fetchProjects]);
  if (loading && projects.length === 0) {
    return <p>Loading projects...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-6xl mt-8">
      {projects.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No projects found. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                {/* 2. Add the actions component */}
                <ProjectActions
                  projectId={project.id}
                  currentName={project.name}
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500">
                  Created on: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Link
                  href={`/project/${project.id}`}
                  className="text-blue-500 hover:underline text-sm font-semibold"
                >
                  View Board →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
