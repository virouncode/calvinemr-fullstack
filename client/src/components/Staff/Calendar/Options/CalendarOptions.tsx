import React from "react";
import Availability from "./Availability";
import FirstDaySelect from "./FirstDaySelect";
import SlotSelect from "./SlotSelect";
import Timezone from "./Timezone";

type CalendarOptionsProps = {
  editAvailability: boolean;
  setEditAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
};

const CalendarOptions = ({
  editAvailability,
  setEditAvailability,
  isPending,
}: CalendarOptionsProps) => {
  return (
    <div className="calendar__options">
      <div className="calendar__options-menu">
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

export default CalendarOptions;
