'use client'; // This must be a client component for hooks and interactivity

import { useTransition, useState } from 'react';
import { submitQuery } from '../_actions/queries'; // Import our Server Action

export function QueryForm() {
  // `isPending` gives us a loading state
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get('queryContent') as string;

    // Reset states
    setMessage(null);
    setError(null);

    // `startTransition` runs the server action without blocking the UI
    startTransition(async () => {
      const result = await submitQuery(content);

      if (result.success) {
        setMessage('Your query has been submitted! I will get back to you soon.');
        (event.target as HTMLFormElement).reset(); // Reset form on success
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        name="queryContent"
        rows={5}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Type your question, suggestion, or request here..."
        disabled={isPending}
        required
        minLength={10}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-fit
                   hover:bg-blue-700 transition-colors
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit Query'}
      </button>

      {/* Show success or error messages */}
      {message && <p className="text-green-600 font-medium">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </form>
  );
}