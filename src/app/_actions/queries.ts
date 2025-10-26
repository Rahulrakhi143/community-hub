'use server'; // This file exports Server Actions

import { auth } from '@clerk/nextjs/server';
import { db } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // We'll use this later

// Define the return type for our action
interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitQuery(content: string): Promise<ActionResult> {
  
  // 1. Get the authenticated user
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'You must be logged in to ask a question.' };
  }

  // 2. Validate input
  if (!content || content.trim().length < 10) {
    return { success: false, error: 'Query must be at least 10 characters long.' };
  }

  // 3. Insert into the database
  try {
    await db.sql`
      INSERT INTO Queries (user_clerk_id, content)
      VALUES (${userId}, ${content});
    `;

    // 4. (Optional) Revalidate the admin path so an admin can see it
    revalidatePath('/admin'); 

    return { success: true };

  } catch (error) {
    console.error('Error submitting query:', error);
    return { success: false, error: 'A database error occurred. Please try again.' };
  }
}