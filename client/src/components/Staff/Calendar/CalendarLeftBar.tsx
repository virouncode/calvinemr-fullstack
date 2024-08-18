import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { SiteType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { getRemainingStaff } from "../../../utils/appointments/parseToEvents";
import CalendarFilter from "./Options/CalendarFilter";
import Shortcutpickr from "./Options/Shortcutpickr";

type CalendarLeftBarProps = {
  handleShortcutpickrChange: (selectedDates: Date[], dateStr: string) => void;
  sites: SiteType[];
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const CalendarLeftBar = ({
  handleShortcutpickrChange,
  sites,
  sitesIds,
  setSitesIds,
  hostsIds,
  setHostsIds,
}: CalendarLeftBarProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="calendar__left-bar">
      <Shortcutpickr handleShortcutpickrChange={handleShortcutpickrChange} />
      <CalendarFilter
        sites={sites}
        sitesIds={sitesIds}
        setSitesIds={setSitesIds}
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        remainingStaff={getRemainingStaff(user.id, staffInfos)}
      />
    </div>
  );
};

export default CalendarLeftBar;
