/**
 * Represents an item in the typeahead dropdown list
 * @interface TypeaheadItem
 */
export interface TypeaheadItem {
  /** Unique identifier for the item */
  id: string | number;
  /** Display text for the item */
  label: string;
  /** Additional properties can be added to the item */
  [key: string]: any;
}

/**
 * Props for the Typeahead component
 * @interface TypeaheadProps
 */
export interface TypeaheadProps {
  /**
   * Function to fetch typeahead suggestions
   * @param query - The search query string
   * @returns Promise resolving to an array of TypeaheadItem
   */
  onSearch: (query: string) => Promise<TypeaheadItem[]>;

  /**
   * Callback function triggered when an item is selected
   * @param item - The selected TypeaheadItem
   */
  onSelect: (item: TypeaheadItem) => void;

  /**
   * Optional custom render function for typeahead items
   * @param item - The TypeaheadItem to render
   * @returns React node representing the item
   */
  renderItem?: (item: TypeaheadItem) => React.ReactNode;

  /** Placeholder text for the input field */
  placeholder?: string;

  /** Delay in milliseconds before triggering the search (default: 300) */
  debounceTime?: number;

  /** Maximum number of results to display */
  maxResults?: number;

  /** Minimum number of characters required before triggering search */
  minQueryLength?: number;

  /** Duration in milliseconds to cache the results (default: 60000) */
  cacheTime?: number;
}

/**
 * Structure for cached typeahead items
 * @interface CacheItem
 */
export interface CacheItem {
  /** Array of cached typeahead items */
  data: TypeaheadItem[];
  /** Timestamp when the cache was created */
  timestamp: number;
}

/**
 * Cache storage structure for typeahead results
 * @interface TypeaheadCache
 */
export interface TypeaheadCache {
  /** Key-value pairs of search queries and their cached results */
  [key: string]: CacheItem;
}
