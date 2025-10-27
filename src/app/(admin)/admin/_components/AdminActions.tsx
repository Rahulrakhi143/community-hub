'use client';

import { useTransition } from 'react';
import { approveContribution } from '@/src/app/_actions/admin'; // Use your alias or '../..'

export function AdminActions({
  contributionId,
  userClerkId,
}: {
  contributionId: number;
  userClerkId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveContribution(contributionId, userClerkId);
      if (result.error) {
        alert(`Error: ${result.error}`);
      }
      // If success, revalidation will automatically remove it from the list
    });
  };

  const handleReject = () => {
    // You would call a 'rejectContribution' server action here
    alert('Reject function not built yet.');
  };

  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
      >
        {isPending ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={handleReject}
        disabled={isPending}
        className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400"
      >
        Reject
      </button>
    </div>
  );
}