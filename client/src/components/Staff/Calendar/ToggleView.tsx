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
    <div className="calendar-section__toggle-view">
      <p
        className={
          timelineVisible
            ? "calendar-section__option"
            : "calendar-section__option calendar-section__option--active"
        }
        onClick={handleClickCalendar}
      >
        Calendar
      </p>
      <p
        className={
          timelineVisible
            ? "calendar-section__option calendar-section__option--active"
            : "calendar-section__option"
        }
        onClick={handleClickRooms}
      >
        Rooms
      </p>
    </div>
  );
};

export default ToggleView;
