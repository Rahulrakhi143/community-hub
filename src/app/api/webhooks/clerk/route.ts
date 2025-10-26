import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent }_ from '@clerk/nextjs/server'
import { db } from '@vercel/postgres' // Import the Vercel Postgres client

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // --- THIS IS THE IMPORTANT PART ---
  // Get the event type
  const eventType = evt.type;

  // If the event is 'user.created', add the user to our database
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Combine first and last name, handling null values
    const username = `${first_name || ''} ${last_name || ''}`.trim();
    const email = email_addresses[0]?.email_address || '';

    try {
      // Insert the new user into our 'Users' table
      await db.sql`
        INSERT INTO Users (clerk_id, username, email, image_url, role)
        VALUES (${id}, ${username}, ${email}, ${image_url}, 'USER');
      `;
      
      console.log(`Successfully created user ${id} in our database.`);
      
    } catch (dbError) {
      console.error('Error inserting user into database:', dbError);
      return new Response('Error occured during database insertion', {
        status: 500
      })
    }
  }

  return new Response('', { status: 200 })
}