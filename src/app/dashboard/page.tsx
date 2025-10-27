import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ContributionForm } from "../_components/ContributionForm";

export default async function DashboardPage() {
  // Get the full user object from Clerk
  const user = await currentUser();

  return (
    // We add dark:bg-gray-900 or similar to the parent 
    // if it's not already in layout.tsx
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              &larr; Back to Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* --- THIS IS THE UPDATED SECTION --- */}
        {/* Welcome Message */}
        <div className="mb-12">
          {/* We add dark:text-gray-100 to the text */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome, {user?.firstName || user?.username}!
          </h2>
          {/* We add dark:text-gray-300 to the paragraphs */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Help grow the community! Let us know what actions you have taken.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your contributions will be reviewed and points will be added to your score.
          </p>
        </div>

        {/* Contribution Form Section */}
        <section>
          {/* This component is already light, so it looks fine! */}
          <ContributionForm />
        </section>

      </main>
    </div>
  );
}