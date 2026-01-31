'use client';

import Link from 'next/link';
import { WalletConnect } from './WalletConnect';

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Stake Pledge</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pledge"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Create Pledge
              </Link>
            </div>
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
