import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SignOutButton } from "../SignoutButton";
import { AddProjectModal } from "../dialogs/AddProjectModat";
import { ProjectList } from "../ProjectList";

export default async function DashboardPage() {
  // 1. Protect the route on the server side

  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, {session.user?.name}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AddProjectModal />
          <SignOutButton />
        </div>
      </header>

      <main className="w-full max-w-6xl">
        <ProjectList />
      </main>
    </div>
  );
}
