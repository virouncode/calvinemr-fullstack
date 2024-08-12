import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";

const useIntersection = <TData, TError>(
  isFetchingNextPage: boolean,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<TData, TError>>,
  isFetching: boolean,
  elementType: string = "div",
  addVisible: boolean = false
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const ulRef = useRef<HTMLUListElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage || addVisible) return;
      if (observer.current) {
        observer.current.disconnect();
      }

      const options: IntersectionObserverInit = {
        root: elementType === "div" ? divRef.current : ulRef.current,
        rootMargin: "0px",
        threshold: 0.5,
      };

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          await fetchNextPage();
        }
      }, options);

      if (node) {
        observer.current.observe(node);
      }
    },
    [addVisible, elementType, fetchNextPage, isFetching, isFetchingNextPage]
  );

  return { ulRef, divRef, lastItemRef };
};

export default useIntersection;
