import React from "react";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import InputDate from "../../UI/Inputs/InputDate";

type DashboardDateFilterProps = {
  rangeStart: number;
  rangeEnd: number;
  onChangeStart: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEnd: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DashboardDateFilter = ({
  rangeStart,
  rangeEnd,
  onChangeStart,
  onChangeEnd,
}: DashboardDateFilterProps) => {
  return (
    <div className="dashboard-card__filter-dates">
      <div className="dashboard-card__filter-dates-item">
        <InputDate
          value={timestampToDateISOTZ(rangeStart)}
          onChange={onChangeStart}
          name="from"
          id="from"
          label="From"
        />
      </div>
      <div className="dashboard-card__filter-dates-item">
        <InputDate
          value={timestampToDateISOTZ(rangeEnd)}
          onChange={onChangeEnd}
          name="to"
          id="to"
          label="To"
        />
      </div>
    </div>
  );
};

export default DashboardDateFilter;
