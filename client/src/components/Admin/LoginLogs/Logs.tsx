import React, { useRef, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import LogsResults from "./LogsResults";
import LogsSearch from "./LogsSearch";

const Logs = () => {
  const [search, setSearch] = useState("");
  const [rangeStart, setRangeStart] = useState(getStartOfTheMonthTZ()); //start of the month
  const [rangeEnd, setRangeEnd] = useState(getEndOfTheMonthTZ()); //end of the month;
  const [all, setAll] = useState(false);
  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);
  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <>
      <LogsSearch
        search={search}
        handleSearch={handleSearch}
        rangeStart={rangeStart}
        setRangeStart={setRangeStart}
        rangeEnd={rangeEnd}
        setRangeEnd={setRangeEnd}
        all={all}
        setAll={setAll}
        initialRangeStart={initialRangeStart}
        initialRangeEnd={initialRangeEnd}
      />
      <LogsResults
        debouncedSearch={debouncedSearch}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />
    </>
  );
};

export default Logs;
