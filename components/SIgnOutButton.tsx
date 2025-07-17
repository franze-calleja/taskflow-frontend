"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </Button>
  );
}
