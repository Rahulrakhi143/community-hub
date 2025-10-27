'use server';

import { db } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Define how many points an approval is worth
const POINTS_PER_APPROVAL = 10;

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function approveContribution(
  contributionId: number,
  userClerkId: string
): Promise<ActionResult> {
  // 1. Check if the *current* user is an admin
  const { sessionClaims } = await auth();
  // sessionClaims.metadata comes back as unknown, so narrow it at runtime safely
  const userRole =
    sessionClaims && typeof sessionClaims.metadata === 'object' && sessionClaims.metadata !== null
      ? (sessionClaims.metadata as { role?: string }).role
      : undefined;
  if (userRole !== 'admin') {
    return { success: false, error: 'Not authorized.' };
  }

  // 2. Perform a database transaction
  // This ensures BOTH queries succeed, or BOTH fail.
  // We don't want to give points without approving, or approve without giving points.
  try {
    const client = await db.connect();
    try {
      await client.sql`BEGIN;`;

      // Query 1: Update the contribution status
      await client.sql`
        UPDATE Contributions
        SET status = 'APPROVED'
        WHERE id = ${contributionId};
      `;

      // Query 2: Update the user's score
      await client.sql`
        UPDATE Users
        SET contribution_score = contribution_score + ${POINTS_PER_APPROVAL}
        WHERE clerk_id = ${userClerkId};
      `;

      await client.sql`COMMIT;`;
    } catch (err) {
      await client.sql`ROLLBACK;`;
      throw err;
    } finally {
      client.release();
    }

    // 3. Revalidate paths to update the UI
    revalidatePath('/admin'); // Removes item from admin list
    revalidatePath('/leaderboard'); // Updates the leaderboard scores

    return { success: true };

  } catch (error) {
    console.error('Error in transaction:', error);
    return { success: false, error: 'Database transaction failed.' };
  }
}

// You would also create a 'rejectContribution' function here