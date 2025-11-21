import React from 'react';
import { WalletConnect } from './WalletConnect';

export default function Navbar({ setRoute }: { setRoute: (r: string) => void }) {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">AgroSafe</h1>
        <nav className="space-x-3">
          <button
            onClick={() => setRoute('dashboard')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Dashboard
          </button>
          <button
            onClick={() => setRoute('register')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Register
          </button>
          <button
            onClick={() => setRoute('produce')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Produce
          </button>
          <button
            onClick={() => setRoute('admin')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Admin
          </button>
          <button
            onClick={() => setRoute('trace')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Trace
          </button>
        </nav>
      </div>
      <div className="flex items-center">
        <WalletConnect />
      </div>
    </header>
  );
}
