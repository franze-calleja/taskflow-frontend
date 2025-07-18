import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// This is the base URL of our Express backend
const BACKEND_URL = 'http://localhost:3001/api/projects';

/**
 * Handles GET requests to fetch projects for the logged-in user.
 */

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.id) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  try{
    // This request is made from the Next.js server, not the browser.
    // We need to pass the user's ID to the backend.
    // Let's modify the backend to accept the user ID from the request.
    // This is a temporary adjustment. A better approach would be to pass a token.
    // For now, let's adjust the backend.
    
    // Let's stick to the token-based approach. We need to get the token.
    // The session object doesn't contain the token by default.
    // Let's adjust the NextAuth config to include it.
    
    // Re-revising. The initial plan was better but my explanation was flawed.
    // The middleware I wrote IS correct. The missing piece is getting the token on the client.
    // Let's go back to that. It's the most explicit and teaches a valuable pattern.
    
    // Let's fix the NextAuth config to expose the token.

    // I apologize for the confusion. Let's proceed with the most direct path.
    // We will add the token to the session.
    
    return NextResponse.json({ message: "This route is under construction" });
  }catch(error){
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 });
  }
}