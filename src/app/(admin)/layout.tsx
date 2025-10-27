import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// This is a type guard to check the metadata
type UserRole = "admin" | "user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If no user, redirect to sign-in
  if (!user) {
    redirect('/sign-in');
  }

  // Get the role from public metadata
  const role = (user.publicMetadata?.role as UserRole) || "user";

  // If the user is NOT an admin, redirect them to their dashboard
  if (role !== "admin") {
    redirect('/dashboard');
  }

  // If they ARE an admin, show the page content
  return (
    <>
      {/* You could add a special Admin Navbar here if you wanted */}
      {children}
    </>
  );
}