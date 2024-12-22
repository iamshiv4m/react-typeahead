import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useTypeaheadCache } from "./useTypeaheadCache";
import "./Typeahead.css";

interface TypeaheadProps {
  onSearch: (query: string) => Promise<any[]>;
  onSelect: (item: any) => void;
  renderItem?: (item: any) => React.ReactNode;
  placeholder?: string;
  debounceTime?: number;
  maxResults?: number;
  minQueryLength?: number;
  cacheTime?: number;
}

/**
 * A customizable typeahead/autocomplete component that provides search suggestions as users type.
 * Features include debounced searching, keyboard navigation, result caching, and customizable rendering.
 *
 * @component
 * @example
 * <Typeahead
 *   onSearch={async (query) => searchApi(query)}
 *   onSelect={(item) => console.log('Selected:', item)}
 *   placeholder="Search users..."
 *   maxResults={5}
 * />
 */
export const Typeahead: React.FC<TypeaheadProps> = ({
  /** Async function that performs the search and returns results */
  onSearch,
  /** Callback function called when an item is selected */
  onSelect,
  /** Optional custom render function for each result item */
  renderItem,
  /** Placeholder text for the input field */
  placeholder = "Search...",
  /** Delay in milliseconds before triggering the search after user input */
  debounceTime = 300,
  /** Maximum number of results to display */
  maxResults = 10,
  /** Minimum number of characters required before triggering a search */
  minQueryLength = 2,
  /** Duration in milliseconds to cache search results */
  cacheTime = 5 * 60 * 1000,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const { getCachedResults, setCachedResults } = useTypeaheadCache(cacheTime);

  /**
   * Performs the search operation with caching and error handling
   * @param searchQuery - The search string to query
   */
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        return;
      }

      // Check cache first
      const cachedResults = getCachedResults(searchQuery);
      if (cachedResults) {
        setResults(cachedResults);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await onSearch(searchQuery);
        const limitedResults = searchResults.slice(0, maxResults);
        setResults(limitedResults);
        setCachedResults(searchQuery, limitedResults);
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, maxResults, minQueryLength, getCachedResults, setCachedResults]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(
      () => performSearch(query),
      debounceTime
    );

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch, debounceTime]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles keyboard navigation and selection events
   * @param event - Keyboard event from the input element
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  /**
   * Handles the selection of an item from the results
   * @param item - The selected TypeaheadItem
   */
  const handleSelect = (item: any) => {
    onSelect(item);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  /**
   * Renders the results list, loading state, or error message
   * @returns React element containing the results UI
   */
  const renderResults = () => {
    if (error) {
      return (
        <div className="typeahead-error" role="alert">
          {error}
        </div>
      );
    }
    if (isLoading) {
      return <div className="typeahead-loading">Loading...</div>;
    }
    if (results.length > 0) {
      return results.map((item, index) => (
        <div
          key={item.id}
          id={`typeahead-item-${index}`}
          className={`typeahead-item ${
            selectedIndex === index ? "selected" : ""
          }`}
          onClick={() => handleSelect(item)}
          role="option"
          aria-selected={selectedIndex === index}
        >
          {renderItem ? renderItem(item) : item.label}
        </div>
      ));
    }
    if (query.length >= minQueryLength) {
      return <div className="typeahead-no-results">No results found</div>;
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  return (
    <div className="typeahead-container" ref={componentRef}>
      <div className="typeahead-input-wrapper">
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="typeahead-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `typeahead-item-${selectedIndex}` : undefined
          }
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="typeahead-input"
        />
        {isLoading && <div className="typeahead-spinner" />}
      </div>

      {isOpen && (
        <div
          id="typeahead-results"
          className="typeahead-results"
          role="listbox"
        >
          {renderResults()}
        </div>
      )}
    </div>
  );
};
