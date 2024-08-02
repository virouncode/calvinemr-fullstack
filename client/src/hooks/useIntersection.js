import { useCallback, useRef } from "react";

const useIntersection = (
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  addVisible = null,
  order = null,
  goToEnd = null
) => {
  const rootRef = useRef(null);
  const observer = useRef(null);
  const lastItemRef = useCallback(
    (node) => {
      if (
        isFetchingNextPage ||
        addVisible
        // (addVisible && order === "asc") ||
        // (!addVisible && goToEnd)
      )
        return;
      if (observer.current) {
        observer.current.disconnect();
      }
      const options = {
        root: rootRef.current,
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
    [addVisible, fetchNextPage, isFetching, isFetchingNextPage]
  );
  return { rootRef, lastItemRef };
};

export default useIntersection;
