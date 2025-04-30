import React from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";

type ToggleViewProps = {
  timelineVisible: boolean;
  setTimelineVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleView = ({
  timelineVisible,
  setTimelineVisible,
}: ToggleViewProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const handleClickCalendar = async () => {
    setTimelineVisible(false);
  };
  const handleClickRooms = async () => {
    setTimelineVisible(true);
  };
  return (
    <div
      className={`${
        timelineVisible
          ? "calendar__toggle calendar__toggle--timeline"
          : "calendar__toggle"
      }`}
    >
      <p
        className={
          timelineVisible
            ? "calendar__toggle-option"
            : "calendar__toggle-option calendar__toggle-option--active"
        }
        onClick={handleClickCalendar}
      >
        Calendar
      </p>
      <p
        className={
          timelineVisible
            ? "calendar__toggle-option calendar__toggle-option--active"
            : "calendar__toggle-option"
        }
        onClick={handleClickRooms}
      >
        Rooms
      </p>
    </div>
  );
};

export default ToggleView;
