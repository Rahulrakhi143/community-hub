import { db } from '@vercel/postgres';
import Link from 'next/link';
import { AdminActions } from './_components/AdminActions';

// Fetch pending contributions, joining with Users table to get username
async function getPendingContributions() {
  const { rows } = await db.sql`
    SELECT 
      c.id, 
      c.platform, 
      c.action_type, 
      c.proof_url_or_handle, 
      c.created_at,
      c.user_clerk_id,
      u.username,
      u.image_url
    FROM Contributions c
    JOIN Users u ON c.user_clerk_id = u.clerk_id
    WHERE c.status = 'PENDING'
    ORDER BY c.created_at ASC;
  `;
  return rows;
}

// Fetch unanswered queries
async function getUnansweredQueries() {
  const { rows } = await db.sql`
    SELECT 
      q.id,
      q.content,
      q.created_at,
      u.username
    FROM Queries q
    JOIN Users u ON q.user_clerk_id = u.clerk_id
    WHERE q.is_answered = FALSE
    ORDER BY q.created_at ASC;
  `;
  return rows;
}


export default async function AdminPage() {
  // Fetch both sets of data in parallel
  const [contributions, queries] = await Promise.all([
    getPendingContributions(),
    getUnansweredQueries()
  ]);

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
        <Link href="/" className="font-medium text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </header>

      {/* Pending Contributions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Pending Contributions ({contributions.length})
        </h2>
        <div className="space-y-4">
          {contributions.length === 0 && <p className="text-gray-500">No pending contributions.</p>}
          
          {contributions.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow-md border flex flex-col md:flex-row md:items-center md:justify-between">
              {/* This text will be dark by default because of the parent */}
              <div>
                <p className="font-semibold text-gray-900"><strong>User:</strong> {c.username}</p>
                <p className="text-gray-800"><strong>Action:</strong> {c.action_type} on {c.platform}</p>
                <p className="text-gray-800"><strong>Proof:</strong> 
                  <a 
                    href={c.proof_url_or_handle.startsWith('http') ? c.proof_url_or_handle : `https://${c.proof_url_or_handle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 underline ml-2"
                  >
                    {c.proof_url_or_handle}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
              <AdminActions 
                contributionId={c.id} 
                userClerkId={c.user_clerk_id} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- THIS IS THE UPDATED SECTION --- */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Unanswered Queries ({queries.length})
        </h2>
        <div className="space-y-4">
          {queries.length === 0 && <p className="text-gray-500">No new queries.</p>}
          
          {queries.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded-lg shadow-md border">
              {/* I've added explicit dark text colors here (e.g., text-gray-900)
                so they are readable on the white background.
              */}
              <p className="font-semibold text-gray-900"><strong>User:</strong> {q.username}</p>
              <p className="text-gray-800 mt-2">{q.content}</p>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(q.created_at).toLocaleString()}
              </p>
              {/* You would add a "Mark as Answered" button here */}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}