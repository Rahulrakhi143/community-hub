import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  // Get the user ID from Clerk
  const { userId } = await auth();

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        {/* This is a pre-built component for profile/sign-out */}
        <UserButton afterSignOutUrl="/" />
      </header>
      
      <main className="mt-8">
        <p className="text-lg">Welcome to your dashboard!</p>
        <p className="text-gray-600">Your User ID is: {userId}</p>

        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          &larr; Back to Home
        </Link>
      </main>
    </div>
  );
}