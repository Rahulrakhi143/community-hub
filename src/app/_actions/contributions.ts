'use server'; // This is a Server Action

import { auth } from '@clerk/nextjs/server';
import { db } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitContribution(formData: FormData): Promise<ActionResult> {
  // 1. Get authenticated user
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'User is not authenticated.' };
  }

  // 2. Get data from the form
  const platform = formData.get('platform') as string;
  const actionType = formData.get('actionType') as string;
  const proof = formData.get('proof') as string;

  // 3. Validate the data
  if (!platform || !actionType || !proof) {
    return { success: false, error: 'All fields are required.' };
  }
  if (proof.length < 3) {
    return { success: false, error: 'Proof must be a valid username or URL.' };
  }

  // 4. Insert into the database
  try {
    await db.sql`
      INSERT INTO Contributions (user_clerk_id, platform, action_type, proof_url_or_handle, status)
      VALUES (${userId}, ${platform}, ${actionType}, ${proof}, 'PENDING');
    `;

    // 5. Revalidate admin path so admin sees the new pending item
    revalidatePath('/admin');

    return { success: true };

  } catch (error) {
    console.error('Error submitting contribution:', error);
    return { success: false, error: 'Database error. Please try again later.' };
  }
}