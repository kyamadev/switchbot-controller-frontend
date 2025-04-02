import { useState, useEffect, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function useApiCache<T>(key: string, fetchFn: () => Promise<T>, expiryTimeMs = 60000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<Record<string, CacheItem<T>>>({});

  const fetchData = async (force = false) => {
    const now = Date.now();
    const cachedItem = cache.current[key];
    
    // Return cached data if it exists and is not expired
    if (!force && cachedItem && now - cachedItem.timestamp < expiryTimeMs) {
      setData(cachedItem.data);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      
      // Update cache
      cache.current[key] = {
        data: result,
        timestamp: now
      };
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key]);

  return { data, loading, error, refetch: () => fetchData(true) };
}