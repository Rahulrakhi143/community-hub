import { db } from '@vercel/postgres';
import Image from 'next/image';
import Link from 'next/link';

// Define the shape of our user data
interface LeaderboardUser {
  clerk_id: string;
  username: string | null;
  image_url: string | null;
  contribution_score: number;
}

// This function runs on the server to get the data
async function getLeaderboard(): Promise<LeaderboardUser[]> {
  const { rows } = await db.sql`
    SELECT 
      clerk_id, 
      username, 
      image_url, 
      contribution_score
    FROM Users
    WHERE contribution_score > 0   -- Only show users who have points
    ORDER BY contribution_score DESC -- Highest score first
    LIMIT 20;                      -- Show the Top 20
  `;
  return rows as LeaderboardUser[];
}

export default async function LeaderboardPage() {
  const users = await getLeaderboard();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 py-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Top Contributors
          </h1>
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </header>

        {/* Leaderboard List */}
        <div className="space-y-4">
          <ol className="list-none space-y-4">
            {users.map((user, index) => (
              <li 
                key={user.clerk_id} 
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                {/* Rank */}
                <span className="text-3xl font-bold text-gray-700 w-12 text-center">
                  {index + 1}
                </span>
                
                {/* Avatar */}
                <Image
                  src={user.image_url || '/default-avatar.png'} // We'll add this default
                  alt={user.username || 'User'}
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-gray-300"
                />
                
                {/* Username */}
                <span className="text-xl font-semibold text-gray-800">
                  {user.username || 'Anonymous User'}
                </span>
                
                {/* Score (pushed to the right) */}
                <span className="ml-auto text-2xl font-bold text-blue-600">
                  {user.contribution_score} Points
                </span>
              </li>
            ))}
          </ol>

          {users.length === 0 && (
            <p className="text-lg text-gray-500 text-center p-8">
              No contributions have been approved yet. Be the first!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}