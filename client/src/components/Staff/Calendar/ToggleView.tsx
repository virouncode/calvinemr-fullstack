import React from "react";

type ToggleViewProps = {
  timelineVisible: boolean;
  setTimelineVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleView = ({
  timelineVisible,
  setTimelineVisible,
}: ToggleViewProps) => {
  const handleClickCalendar = () => {
    setTimelineVisible(false);
  };
  const handleClickRooms = () => {
    setTimelineVisible(true);
  };
  return (
    <div className="calendar__toggle">
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
