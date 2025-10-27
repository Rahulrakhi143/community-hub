import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { QueryForm } from './_components/QueryForm';
import { SocialLinks } from './_components/SocialLinks';

export default async function HomePage() {
  // Get the current user's ID. Will be null if logged out.
  const { userId } = await auth();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-12 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Community Hub
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="font-medium text-blue-600 hover:underline">
              Leaderboard
            </Link>
            {userId ? (
              <>
                <Link href="/dashboard" className="font-medium text-blue-600 hover:underline">
                  Dashboard
                </Link>
                {/* This is the user profile button from Clerk */}
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="font-medium text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Social Links Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Connect With Me
          </h2>
          <SocialLinks />
        </section>

        {/* Query Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Have a Question?
          </h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
            {userId ? (
              <QueryForm />
            ) : (
              <p className="text-lg text-gray-600">
                Please{' '}
                <Link href="/sign-in" className="text-blue-600 font-semibold underline">
                  sign in
                </Link>{' '}
                to ask a question or submit a query.
              </p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}