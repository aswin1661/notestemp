// app/search/page.tsx (Search Page)
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the results page with the search query as a URL parameter
      router.push(`/results?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      <h1>Search Data</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter search keywords separated by space or comma"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
