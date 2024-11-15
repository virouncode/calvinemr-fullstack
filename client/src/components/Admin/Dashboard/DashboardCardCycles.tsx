import React, { useState } from "react";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import {
  dateISOToTimestampTZ,
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";

const DashboardCardCycles = () => {
  //Hooks
  const [rangeStartCycles, setRangeStartCycles] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndCycles, setRangeEndCycles] = useState(getEndOfTheMonthTZ());
  //Queries
  // const {
  //   data: visits,
  //   isPending: isPendingCycles,
  //   error: errorCycles,
  // } = useDashboardCycles(rangeStartCycles, rangeEndCycles);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeStartCycles(dateISOToTimestampTZ(value) as number);
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeEndCycles((dateISOToTimestampTZ(value) as number) + 86399999);
  };
  return <div></div>;
};

export default DashboardCardCycles;
