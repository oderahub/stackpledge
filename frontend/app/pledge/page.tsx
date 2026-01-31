'use client';

import Link from 'next/link';
import { PledgeForm } from '@/components/PledgeForm';

export default function PledgePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Pledge</h1>
        <p className="text-gray-600">
          Stake STX on your commitment. If you succeed, claim it back. If you fail, it burns.
        </p>
      </div>

      <PledgeForm />

      <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h3 className="font-semibold text-orange-900 mb-2">How it works</h3>
        <ol className="text-sm text-orange-800 space-y-2">
          <li>1. Describe your commitment and set a deadline</li>
          <li>2. Choose a trusted judge who will verify your completion</li>
          <li>3. Stake STX - this gets locked until judged</li>
          <li>4. Complete your commitment before the deadline</li>
          <li>5. Your judge marks it as success or failure</li>
          <li>6. Success? Claim your stake back. Failure? It gets burned.</li>
        </ol>
      </div>
    </div>
  );
}
