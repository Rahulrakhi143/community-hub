import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ContributionForm } from "../_components/ContributionForm";

export default async function DashboardPage() {
  // Get the full user object from Clerk
  const user = await currentUser();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-medium text-blue-600 hover:underline">
              &larr; Back to Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Welcome Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            {user
              ? <>Welcome, {user.firstName || user.username}!</>
              : <>Welcome!</>
            }
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Help grow the community! Let us know what actions you have taken.
          </p>
          <p className="text-lg text-gray-600">
            Your contributions will be reviewed and points will be added to your score.
          </p>
        </div>

        {/* Contribution Form Section */}
        <section>
          <ContributionForm />
        </section>

      </main>
    </div>
  );
}