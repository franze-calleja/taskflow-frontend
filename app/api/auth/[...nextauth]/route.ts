import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions ={
  // We are using JSON Web Tokens for session management
  session: {
    strategy:"jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
        credentials: {
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req){
        if (!credentials?.email || !credentials?.password){
          return null;
        }
        
        try{
          // Make a POST request to our backend login endpoint
          const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          // Check if the request was successful
          if (!res.ok){
            // res.ok is false if the status code is 4xx or 5xx
            return null;
          }
          const user = await res.json();

          // If we get a user object back, the login was successful
          if (user){
            return user; // This user object will be encoded in the JWT

          }else{
            return null;
          }
        } catch(error){
          console.error("Authorize Error:", error);
          return null;
        }
        
      }
    })
  ],
  // ADD CALLBACKS SECTION

  callbacks:{
    async jwt({token, user}){
      // When the user signs in, the `user` object from `authorize` is passed here.
      // We are adding the user's id to the token.
      if(user){
        token.id = user.id;
      }
      return token;
    },

    async session({session, token}){
      // The session callback is called whenever a session is checked.
      // We are adding the user's id (from the token) to the session object.
      if (session.user){
        session.user.id = token.id as string;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}