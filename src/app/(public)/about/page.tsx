"use client";

import { useSession } from "next-auth/react";

export default function About() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>About</h1>
      <p>This is a public page. It can be accessed without authentication.</p>
      {session ? (
        <p>
          You are logged in as <strong>{session.user?.email}</strong>.
        </p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
