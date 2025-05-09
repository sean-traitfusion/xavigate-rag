import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, ArrowRight, Compass } from 'lucide-react'; // Import Lucide icons

export default function SignIn() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    signIn(username.trim());
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-center mb-6">
        <Compass className="h-8 w-8 text-blue-600 mr-2" /> {/* Compass icon representing navigation/alignment */}
        <h2 className="text-2xl font-semibold text-gray-800">Welcome to Xavigate</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your name:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" /> {/* User icon */}
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
          Begin Your Alignment Journey
          <ArrowRight className="ml-2 h-5 w-5" /> {/* Arrow icon */}
        </button>
        <p className="mt-2 text-sm text-center text-gray-600">
          Discover your natural traits and find your alignment
        </p>
      </form>
    </div>
  );
}