import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SIgnOutButton";

export default async function DashboardPage() {
  // 1. Protect the route on the server side

  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to TaskFlow!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Signed in as {session.user?.name || session.user?.email}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          User ID: {session.user?.id}
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
