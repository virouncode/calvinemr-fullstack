import React from "react";
import { SiteType } from "../../../../types/api";
import { RemainingStaffType } from "../../../../types/app";
import XmarkRectangleIcon from "../../../UI/Icons/XmarkRectangleIcon";
import FilterCheckboxes from "./FilterCheckboxes";
import SitesCheckboxes from "./SitesCheckboxes";

type CalendarFilterMobileProps = {
  sites: SiteType[];
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
  remainingStaff: RemainingStaffType[];
  setMobileCalendarFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalendarFilterMobile = ({
  sites,
  sitesIds,
  setSitesIds,
  hostsIds,
  setHostsIds,
  remainingStaff,
  setMobileCalendarFilterVisible,
}: CalendarFilterMobileProps) => {
  const handleClose = () => {
    setMobileCalendarFilterVisible(false);
  };
  return (
    <div className="calendar__mobile-filter">
      <div className="calendar__mobile-filter-header">
        <XmarkRectangleIcon size="2x" onClick={handleClose} />
      </div>
      <p className="calendar__mobile-filter-title">Show Calendars</p>
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

export default CalendarFilterMobile;
