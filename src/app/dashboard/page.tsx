import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ContributionForm } from "../_components/ContributionForm";

export default async function DashboardPage() {
  // Get the full user object from Clerk
  const user = await currentUser();

  return (
    // Make sure the background color is set
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 py-4">
          {/* Added dark:text-gray-100 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {/* Added dark:text-blue-400 for the link */}
            <Link href="/" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              &larr; Back to Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Welcome Message (UPDATED SECTION) */}
        <div className="mb-12">
          {/* Added dark:text-gray-100 */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome, {user?.firstName || user?.username}!
          </h2>
          {/* Added dark:text-gray-300 */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Help grow the community! Let us know what actions you have taken.
          </p>
          {/* Added dark:text-gray-300 */}
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your contributions will be reviewed and points will be added to your score.
          </p>
        </div>

        {/* Contribution Form Section */}
        <section>
          {/* This component is already light, so it's fine */}
          <ContributionForm />
        </section>

      </main>
    </div>
  );
}