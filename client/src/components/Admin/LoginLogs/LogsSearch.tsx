import React from "react";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import Checkbox from "../../UI/Checkbox/Checkbox";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";

type LogsSearchProps = {
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rangeStart: number;
  rangeEnd: number;
  setRangeStart: React.Dispatch<React.SetStateAction<number>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<number>>;
  all: boolean;
  setAll: React.Dispatch<React.SetStateAction<boolean>>;
  initialRangeStart: React.MutableRefObject<number>;
  initialRangeEnd: React.MutableRefObject<number>;
};

const LogsSearch = ({
  search,
  handleSearch,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  all,
  setAll,
  initialRangeStart,
  initialRangeEnd,
}: LogsSearchProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    if (!value) return;
    if (name === "date_start") {
      initialRangeStart.current = dateISOToTimestampTZ(value) as number;
      setRangeStart(dateISOToTimestampTZ(value) as number);
    }
    if (name === "date_end") {
      initialRangeEnd.current =
        (dateISOToTimestampTZ(value) as number) + 86399999;
      setRangeEnd((dateISOToTimestampTZ(value) as number) + 86399999);
    }
  };
  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart(-5364662400000); // 1900-01-01
      setRangeEnd(32503680000000); // 3000-01-01
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
    }
  };

  return (
    <div className="logs__search">
      <div className="logs__search-input">
        <Input
          value={search}
          onChange={handleSearch}
          placeholder="Search by user name..."
          autoFocus={true}
        />
      </div>

      <div className="logs__search-filter">
        <div className="logs__search-filter-item">
          <InputDate
            value={timestampToDateISOTZ(rangeStart)}
            onChange={handleDateChange}
            name="date_start"
            id="from"
            label="From"
            disabled={all}
          />
        </div>
        <div className="logs__search-filter-item">
          <InputDate
            value={timestampToDateISOTZ(rangeEnd)}
            onChange={handleDateChange}
            name="date_end"
            id="to"
            label="To"
            disabled={all}
          />
        </div>
        <div className="logs__search-filter-checkbox">
          <Checkbox
            id="all"
            name="all"
            onChange={handleCheckAll}
            checked={all}
            label="All"
          />
        </div>
      </div>
    </div>
  );
};

export default LogsSearch;
