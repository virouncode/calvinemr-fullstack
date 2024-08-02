
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
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
        {isPending && (
          <div style={{ fontSize: "0.8rem", padding: "5px" }}>
            <LoadingParagraph />
          </div>
        )}
      </div>
      <Timezone />
    </div>
  );
};

export default CalendarOptions;
