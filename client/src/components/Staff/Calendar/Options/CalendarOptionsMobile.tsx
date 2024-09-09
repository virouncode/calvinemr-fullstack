import React from "react";
import XmarkRectangleIcon from "../../../UI/Icons/XmarkRectangleIcon";
import Availability from "./Availability";
import FirstDaySelect from "./FirstDaySelect";
import SlotSelect from "./SlotSelect";
import Timezone from "./Timezone";

type CalendarOptionsMobileProps = {
  editAvailability: boolean;
  setEditAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
  setMobileCalendarOptionsVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

const CalendarOptionsMobile = ({
  editAvailability,
  setEditAvailability,
  isPending,
  setMobileCalendarOptionsVisible,
}: CalendarOptionsMobileProps) => {
  const handleClose = () => {
    setMobileCalendarOptionsVisible(false);
  };
  return (
    <div className="calendar__mobile-options">
      <div className="calendar__mobile-options-header">
        <XmarkRectangleIcon size="2x" onClick={handleClose} />
      </div>
      <div className="calendar__mobile-options-menu">
        <SlotSelect />
        <FirstDaySelect />
        <Availability
          editAvailability={editAvailability}
          setEditAvailability={setEditAvailability}
          isPending={isPending}
        />
      </div>
      <Timezone />
    </div>
  );
};

export default CalendarOptionsMobile;
