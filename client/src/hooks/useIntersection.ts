import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";

const useIntersection = <TElement extends HTMLElement | null>(
  isFetchingNextPage: boolean,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<unknown, unknown>>,
  isFetching: boolean,
  addVisible: boolean = false
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rootRef = useRef<TElement | null>(null);

  const targetRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage || addVisible) return;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const options: IntersectionObserverInit = {
        root: rootRef.current,
        rootMargin: "0px",
        threshold: 0.1, //10% of the item is visible
      };

      observerRef.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          try {
            await fetchNextPage();
          } catch (error) {
            console.error("Error fetching next page:", error);
          }
        }
      }, options);

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [addVisible, fetchNextPage, isFetching, isFetchingNextPage]
  );

  return { rootRef, targetRef };
};

export default useIntersection;
