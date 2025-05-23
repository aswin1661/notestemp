"use client";
import { useEffect, useState } from 'react';

type Row = {
  c: Array<{ v: string | number | null } | undefined>;
};

const ResultsPage = () => {
  const [data, setData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('query') ?? '';
    setSearchQuery(query);
  }, []);

  // Delay showing the loader to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(true), 300); // Show loader only after 300ms
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sheetId = '1R9hJjxUYZCNgntXunSAhzxKLlBgUCL6RBZLc1gPt5Ks';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const fetchSheetData = async () => {
      try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        setData(rows);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // Filter based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData([]);
      return;
    }

    const keywords = searchQuery
      .split(/[ ,]+/)
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword.length > 0);

    const filtered = data.filter((row: Row) =>
      keywords.every((keyword) =>
        row.c.some((cell) => {
          if (cell?.v) {
            const cellValue = typeof cell.v === 'string' ? cell.v.toLowerCase() : String(cell.v).toLowerCase();
            return cellValue.includes(keyword);
          }
          return false;
        })
      )
    );

    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Conditional rendering
  if (loading && showLoader) {
    return (
      <div className='h-[100vh] w-full flex items-center justify-center flex-col'>
        Loading...
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
  <div className='h-[90vh] w-full flex items-center justify-center flex-col'>
    <h2 className='font-bold'>Available downloads</h2>

    {loading && showLoader ? (
      <div>Loading...</div>
    ) : filteredData.length > 0 ? (
      filteredData.map((row: Row, index: number) => {
        const [col1, col2, col3, col4, col5] = row.c;
        return (
          <div key={index} className='p-4 m-2 bg-white text-black rounded shadow'>
            <p>dept: {col1?.v ?? 'N/A'}</p>
            <p>semester: {col2?.v ?? 'N/A'}</p>
            <p>subject: {col3?.v ?? 'N/A'}</p>
            <p>the resource found</p>
            <p>link: {col4?.v ?? 'N/A'}</p>
            <p>title: {col5?.v ?? 'N/A'}</p>
          </div>
        );
      })
    ) : (
      <p>No resource found.</p>
    )}
  </div>
);
;
};

export default ResultsPage;
