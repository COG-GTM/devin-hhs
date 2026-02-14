'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderSearch() {
  const [npi, setNpi] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (npi.trim()) {
      router.push(`/provider/${npi.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={npi}
        onChange={(e) => setNpi(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter NPI..." 
        className="w-full border-2 border-black px-3 py-2 text-sm font-mono"
      />
      <button 
        type="submit"
        className="w-full mt-2 bg-black text-white px-3 py-2 text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
