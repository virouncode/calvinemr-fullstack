import React, { useState } from "react";
import { todayTZTimestamp } from "../../../utils/dates/formatDates";
import { CycleTypeType } from "../../UI/Lists/CycleTypeList";
import AllCyclesForm from "./AllCyclesForm";
import AllCyclesResults from "./AllCyclesResults";

const AllCycles = () => {
  const [search, setSearch] = useState<{
    range_start: number;
    range_end: number;
    site_id: number;
    assigned_md: number;
    cycle_type: CycleTypeType | "all";
  }>({
    range_start: todayTZTimestamp(),
    range_end: todayTZTimestamp() + 86400000,
    site_id: -1,
    assigned_md: -1,
    cycle_type: "all",
  });
  return (
    <>
      <AllCyclesForm search={search} setSearch={setSearch} />
      <AllCyclesResults search={search} />
    </>
  );
};

export default AllCycles;
