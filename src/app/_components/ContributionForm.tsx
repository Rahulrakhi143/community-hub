'use client'; // This is a Client Component

import { useTransition, useState, useRef } from 'react';
import { submitContribution } from '../_actions/contributions';

export function ContributionForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // To reset the form

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await submitContribution(formData);

      if (result.success) {
        setMessage('Contribution submitted for review!');
        formRef.current?.reset(); // Reset the form fields
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <h3 className="text-xl font-semibold text-gray-900">Submit a Contribution</h3>
      
      {/* Platform Selection */}
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
          Platform
        </label>
        {/* --- I'VE ADDED 'text-gray-900' HERE --- */}
        <select
          name="platform"
          id="platform"
          required
          disabled={isPending}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
        >
          <option value="">Select a platform...</option>
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Discord">Discord</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Action Type Selection */}
      <div>
        <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-1">
          Action
        </label>
        {/* --- I'VE ADDED 'text-gray-900' HERE --- */}
        <select
          name="actionType"
          id="actionType"
          required
          disabled={isPending}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
        >
          <option value="">Select an action...</option>
          <option value="follow">Follow</option>
          <option value="share">Share / Retweet</option>
          <option value="tag">Tag / Mention</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Proof Input */}
      <div>
        <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-1">
          Proof (Your username or URL)
        </label>
        {/* --- I'VE ADDED 'text-gray-900' HERE --- */}
        <input
          type="text"
          name="proof"
          id="proof"
          required
          disabled={isPending}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          placeholder="e.g., @myusername or https://twitter.com/..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold 
                   hover:bg-green-700 transition-colors
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? 'Submitting...' : 'Submit for Review'}
      </button>

      {/* Messages */}
      {message && <p className="text-green-600 font-medium">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </form>
  );
}