import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export const useFetchAllPages = <TData, TError>(
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<TData, TError>>,
  hasNextPage: boolean,
  selectAll: boolean = true
) => {
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchAllPages = async () => {
      if (!hasNextPage || isFetchingAll) return;

      setIsFetchingAll(true);
      let hasMorePages = true;
      while (hasMorePages) {
        const response = await fetchNextPage();
        // Update hasMorePages based on response
        hasMorePages = !!response.hasNextPage;
      }
      setIsFetchingAll(false);
    };

    // Only fetch if the component is mounted and there are more pages to fetch
    if (isMounted.current && hasNextPage && selectAll) {
      fetchAllPages();
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetchNextPage, hasNextPage, isFetchingAll, selectAll]);
};
