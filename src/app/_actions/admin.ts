'use server';

import { db } from '@vercel/postgres';
import { auth } from '@clerk/nextjs';
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
  const { sessionClaims } = auth();

  // --- THIS IS THE LINE TO FIX ---
  // Change 'metadata.role' to 'public_metadata.role'
  if ((sessionClaims?.public_metadata as any)?.role !== 'admin') {
    // We cast to 'any' to bypass TypeScript errors since it doesn't know our custom claim
    return { success: false, error: 'Not authorized.' };
  }

  // 2. Perform a database transaction
  try {
    await db.tx(async (tx) => {
      // Query 1: Update the contribution status
      await tx.sql`
        UPDATE Contributions
        SET status = 'APPROVED'
        WHERE id = ${contributionId};
      `;

      // Query 2: Update the user's score
      await tx.sql`
        UPDATE Users
        SET contribution_score = contribution_score + ${POINTS_PER_APPROVAL}
        WHERE clerk_id = ${userClerkId};
      `;
    });

    // 3. Revalidate paths to update the UI
    revalidatePath('/admin');
    revalidatePath('/leaderboard');

    return { success: true };

  } catch (error) {
    console.error('Error in transaction:', error);
    return { success: false, error: 'Database transaction failed.' };
  }
}