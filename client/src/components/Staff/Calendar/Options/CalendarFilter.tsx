import React from "react";
import { SiteType } from "../../../../types/api";
import { RemainingStaffType } from "../../../../types/app";
import FilterCheckboxes from "./FilterCheckboxes";
import SitesCheckboxes from "./SitesCheckboxes";

type CalendarFilterProps = {
  sites: SiteType[];
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
  remainingStaff: RemainingStaffType[];
};

const CalendarFilter = ({
  sites,
  sitesIds,
  setSitesIds,
  hostsIds,
  setHostsIds,
  remainingStaff,
}: CalendarFilterProps) => {
  return (
    <div className="calendar__filter">
      <p className="calendar__filter-title">Show Calendars</p>
      <SitesCheckboxes
        sites={sites}
        sitesIds={sitesIds}
        setSitesIds={setSitesIds}
      />
      <FilterCheckboxes
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        remainingStaff={remainingStaff}
      />
    </div>
  );
};

export default CalendarFilter;
