"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectStore } from "@/store/ProjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="w-full max-w-4xl mt-8">
      {projects.length === 0 && !loading ? (
        <p>No projects found. Create your first one!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Created on: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
