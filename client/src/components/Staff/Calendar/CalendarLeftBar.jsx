import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { getRemainingStaff } from "../../../utils/appointments/parseToEvents";
import CalendarFilter from "./Options/CalendarFilter";
import Shortcutpickr from "./Options/Shortcutpickr";

const CalendarLeftBar = ({
  handleShortcutpickrChange,
  sites,
  sitesIds,
  setSitesIds,
  hostsIds,
  setHostsIds,
}) => {
  const { user } = useUserContext();
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
