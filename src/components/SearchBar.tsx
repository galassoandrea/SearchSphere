import { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css'

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 w-5/6 md:mt-4">
      <input
        type="text"
        placeholder="Type your search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 text-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-md hover:bg-purple-100 cursor-pointer transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;