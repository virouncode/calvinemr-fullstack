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
    <div>
      <InputDate
        value={timestampToDateISOTZ(rangeStart)}
        onChange={onChangeStart}
        name="from"
        id="from"
        label="From"
      />
      <InputDate
        value={timestampToDateISOTZ(rangeEnd)}
        onChange={onChangeEnd}
        name="to"
        id="to"
        label="To"
      />
    </div>
  );
};

export default DashboardDateFilter;
