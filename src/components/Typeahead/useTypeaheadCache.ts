import { useState, useCallback } from "react";
import { TypeaheadCache, TypeaheadItem } from "./types";

/**
 * Custom hook for caching typeahead results to improve performance
 * @param cacheTime - Duration in milliseconds to keep items in cache (default: 5 minutes)
 * @returns Object containing functions to get and set cached results
 */
export const useTypeaheadCache = (cacheTime: number = 5 * 60 * 1000) => {
  const [cache, setCache] = useState<TypeaheadCache>({});

  /**
   * Retrieves cached results for a given query if they exist and haven't expired
   * @param query - The search query string
   * @returns Array of TypeaheadItems if cached and valid, null otherwise
   */
  const getCachedResults = useCallback(
    (query: string): TypeaheadItem[] | null => {
      const cached = cache[query];
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
      return null;
    },
    [cache, cacheTime]
  );

  /**
   * Stores typeahead results in cache with current timestamp
   * @param query - The search query string
   * @param results - Array of TypeaheadItems to cache
   */
  const setCachedResults = useCallback(
    (query: string, results: TypeaheadItem[]) => {
      setCache((prev) => ({
        ...prev,
        [query]: {
          data: results,
          timestamp: Date.now(),
        },
      }));
    },
    []
  );

  return { getCachedResults, setCachedResults };
};
