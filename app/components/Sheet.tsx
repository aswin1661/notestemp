"use client"
import { useEffect, useState } from 'react';

// Define the type for rows of data from the Google Sheets
type Row = {
  c: Array<{ v: string | number | null } | undefined>;
};

type GoogleSheetDataProps = {
  keywords: string[]; // Expecting keywords as an array of strings
};

const GoogleSheetData = ({ keywords }: GoogleSheetDataProps) => {
  const [data, setData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]); // State for filtered data
  const [loading, setLoading] = useState<boolean>(true);

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
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []); // Fetch data on component mount

  useEffect(() => {
    // Ensure there are exactly three keywords provided
    if (keywords.length === 3) {
      const filtered = data.filter((row: Row) => {
        return keywords.every((keyword) =>
          row.c.some((cell) => {
            if (cell?.v) {
              // Handle string or number separately
              const cellValue = typeof cell.v === 'string' ? cell.v.toLowerCase() : String(cell.v).toLowerCase();
              return cellValue.includes(keyword.toLowerCase()); // Case-insensitive check
            }
            return false;
          })
        );
      });
      setFilteredData(filtered); // Set filtered rows
    } else {
      setFilteredData([]); // If fewer than three keywords, show no rows
    }
  }, [keywords, data]); // Re-run the effect when keywords or data change

  if (loading) return <div>Loading...</div>;

  return (
    <div className='h-[90vh] w-full flex items-center justify-center flex-col'>
      <h2 className='font-bold'>Available downloads</h2>
      
      {filteredData.length > 0 ? (
        filteredData.map((row: Row, index: number) => {
          const [col1, col2, col3, col4, col5] = row.c;
          return (
            <div key={index}>
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
};

export default GoogleSheetData;
