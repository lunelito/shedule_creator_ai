"use client"
import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  isPending: boolean;
  error: string | null;
}

export default function useFetch<T = unknown>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsPending(true);
      setError(null);

      if(url == null){
        setIsPending(false)
        return 0
      }

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Błąd HTTP: ${res.status}`);
        }

        const json = (await res.json()) as T;

        if (!isCancelled) {
          setData(json);
          setIsPending(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setIsPending(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { data, isPending, error } as FetchState<T>;
}