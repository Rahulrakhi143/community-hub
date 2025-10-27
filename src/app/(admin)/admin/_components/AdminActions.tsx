'use client';

import { useTransition } from 'react';
// Import both actions
import { approveContribution, rejectContribution } from '@/src/app/_actions/admin';

export function AdminActions({
  contributionId,
  userClerkId,
}: {
  contributionId: number;
  userClerkId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    // We wrap this in startTransition so the UI stays responsive
    startTransition(async () => {
      const result = await approveContribution(contributionId, userClerkId);
      if (result.error) {
        alert(`Error: ${result.error}`);
      }
      // On success, revalidation will remove it
    });
  };

  // --- ADD THIS NEW HANDLER ---
  const handleReject = () => {
    // We wrap this in startTransition as well
    startTransition(async () => {
      // Show a confirmation dialog before rejecting
      if (window.confirm('Are you sure you want to reject this contribution?')) {
        const result = await rejectContribution(contributionId);
        if (result.error) {
          alert(`Error: ${result.error}`);
        }
        // On success, revalidation will remove it
      }
    });
  };

  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      <button
        onClick={handleApprove}
        disabled={isPending} // Disable when *any* action is pending
        className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
      >
        {isPending ? 'Working...' : 'Approve'}
      </button>
      <button
        onClick={handleReject}
        disabled={isPending} // Disable when *any* action is pending
        className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400"
      >
        {isPending ? 'Working...' : 'Reject'}
      </button>
    </div>
  );
}