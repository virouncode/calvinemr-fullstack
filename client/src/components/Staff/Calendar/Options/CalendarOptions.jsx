import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";
import Availability from "./Availability";
import FirstDaySelect from "./FirstDaySelect";
import SlotSelect from "./SlotSelect";
import Timezone from "./Timezone";

const CalendarOptions = ({
  editAvailabilityVisible,
  setEditAvailabilityVisible,
  isPending,
}) => {
  return (
    <div className="calendar__options">
      <div className="calendar__options-menu">
        <SlotSelect />
        <FirstDaySelect />
        <Availability
          editAvailabilityVisible={editAvailabilityVisible}
          setEditAvailabilityVisible={setEditAvailabilityVisible}
        />
        {isPending && <CircularProgressSmall />}
      </div>
      <Timezone />
    </div>
  );
};

export default CalendarOptions;
