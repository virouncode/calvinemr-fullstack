import { useEffect, useState } from "react";
//eslint-disable-next-line
const useDebounce = (search: any, delay: number) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, delay);

    // Clear the timer if search changes before the 1000ms delay
    return () => clearTimeout(timer);
  }, [search, delay]);
  return debouncedSearch;
};

export default useDebounce;
