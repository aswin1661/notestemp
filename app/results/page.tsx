// app/results/page.tsx (Results Page)
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Define the type for rows of data from the Google Sheets
type Row = {
  c: Array<{ v: string | number | null } | undefined>;
};

const ResultsPage = () => {
  const [data, setData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // Get search params from URL
  const searchQuery = searchParams?.get('query') ?? ''; // Get the search query

  useEffect(() => {
    const sheetId = '1R9hJjxUYZCNgntXunSAhzxKLlBgUCL6RBZLc1gPt5Ks';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const fetchSheetData = async () => {
      try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        setData(rows); // Store all rows
        setFilteredData(rows); // Initially, display all rows
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []); // Fetch data on component mount

  useEffect(() => {
    if (searchQuery) {
      // Normalize the search query by trimming and splitting into keywords (space or comma separated)
      const keywords = searchQuery
        .split(/[ ,]+/) // Split by space or comma
        .map((keyword) => keyword.trim().toLowerCase()) // Normalize each keyword
        .filter((keyword) => keyword.length > 0); // Remove empty keywords

      // Check for which keywords exist in the database
      const validKeywords = keywords.filter((keyword) =>
        data.some((row: Row) =>
          row.c.some((cell) => {
            if (cell?.v) {
              const cellValue = typeof cell.v === 'string' ? cell.v.toLowerCase() : String(cell.v).toLowerCase();
              return cellValue.includes(keyword); // Check if keyword exists in any column
            }
            return false;
          })
        )
      );

      // Filter rows using the valid keywords (OR condition)
      const filtered = data.filter((row: Row) => {
        return validKeywords.every((keyword) =>
          row.c.some((cell) => {
            if (cell?.v) {
              const cellValue = typeof cell.v === 'string' ? cell.v.toLowerCase() : String(cell.v).toLowerCase();
              return cellValue.includes(keyword); // Case-insensitive check
            }
            return false;
          })
        );
      });

      setFilteredData(filtered); // Set filtered rows based on valid keywords
    } else {
      setFilteredData([]); // If no search query, show no rows
    }
  }, [searchQuery, data]); // Re-run filtering when searchQuery or data changes

  if (loading) return <div className='h-[100vh] w-full flex items-center justify-center flex-col'>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
     <div className='min-h-screen h-auto  w-full flex items-center justify-center flex-col'>
      <h2 className='font-bold'>Available downloads</h2>
      
      {filteredData.length > 0 ? (
        filteredData.map((row: Row, index: number) => {
          const [col1, col2, col3, col4, col5] = row.c;
          return (
            <div className='flex h-[4rem] w-auto p-[2vw] rounded-3xl flex items-center justify-evenly flex-row m-[3vh] bg-white text-black'  key={index}>
              <p>dept: {col1?.v ?? 'N/A'}        .</p>
              <p>semester: {col2?.v ?? 'N/A'}   . </p>
              <p>subject: {col3?.v ?? 'N/A'}     . </p>
              <p>the resource found               </p>
              <p>link: {col4?.v ?? 'N/A'}         .</p>
              <p>title: {col5?.v ?? 'N/A'}        .</p>
            </div>
          );
        })
      ) : (
        <p>No resource found.</p>
      )}
    </div>
  );
};

export default ResultsPage;
