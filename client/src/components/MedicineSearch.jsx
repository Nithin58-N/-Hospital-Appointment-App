import React, { useState, useEffect, useRef } from 'react';
import { API } from '../api';

export default function MedicineSearch({ onSelect, medicineType }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Debounced search
    if (query.length >= 2) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        searchMedicines();
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, medicineType]); // Added medicineType to dependencies

  useEffect(() => {
    // Click outside to close
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function searchMedicines() {
    try {
      setLoading(true);
      // Add medicineType filter to the query if provided
      let url = `/medicines/search?q=${query}&limit=10`;
      if (medicineType) {
        url += `&form=${medicineType}`;
      }
      const response = await API.get(url);
      const data = response.data.data || response.data;
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Medicine search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(medicine) {
    onSelect(medicine);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  }

  function handleKeyDown(e) {
    if (!showResults || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setShowResults(true)}
        placeholder={medicineType ? `Search ${medicineType}...` : "Search medicine by name..."}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
          {results.map((medicine, index) => (
            <div
              key={medicine._id}
              onClick={() => handleSelect(medicine)}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 ${
                index === selectedIndex ? 'bg-blue-100 dark:bg-gray-600' : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{medicine.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {medicine.genericName} • {medicine.strength.join(', ')} • {medicine.form}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{medicine.category}</div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          No medicines found
        </div>
      )}
    </div>
  );
}
