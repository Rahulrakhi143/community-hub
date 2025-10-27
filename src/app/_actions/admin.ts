'use server';

import { db } from '@vercel/postgres'; // This is correct
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

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

  // 2. Check the public_metadata claim for the role
  if ((sessionClaims?.public_metadata as any)?.role !== 'admin') {
    return { success: false, error: 'Not authorized.' };
  }

  // 3. --- THIS IS THE FIX ---
  // Get a client from the Vercel Postgres pool
  const client = await db.connect();

  try {
    // Start the transaction
    await client.query('BEGIN');

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

    // Commit the transaction
    await client.query('COMMIT');
    
    // 4. Revalidate paths to update the UI
    revalidatePath('/admin');
    revalidatePath('/leaderboard');

    return { success: true };

  } catch (error) {
    // If ANY error occurs, roll back the entire transaction
    await client.query('ROLLBACK');
    console.error('Error in transaction:', error);
    return { success: false, error: 'Database transaction failed.' };
    
  } finally {
    // ALWAYS release the client back to the pool
    client.release();
  }
}