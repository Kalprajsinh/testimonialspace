"use client";

import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isSignedIn ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome, {user?.emailAddresses[0].emailAddress || user?.username}!</h1>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Welcome to MyApp</h1>
        </div>
      )}
    </div>
  );
}
