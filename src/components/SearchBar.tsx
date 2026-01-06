import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from './ui/Input';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceDelay?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher...',
  onSearch,
  defaultValue = '',
  debounceDelay = 500,
}) => {
  const [query, setQuery] = useState(defaultValue);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay, onSearch]);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={query}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      icon={<FaSearch />}
    />
  );
};
