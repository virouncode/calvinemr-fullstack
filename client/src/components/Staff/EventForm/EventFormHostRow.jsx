import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import HostsSelect from "./Host/HostsSelect";
import RecurrenceSelect from "./RecurrenceSelect";

const EventFormHostRow = ({
  formDatas,
  handleHostChange,
  handlePurposeChange,
  handleRecurrenceChange,
  handleUntilChange,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="event-form__row">
      <div className="event-form__item">
        <label>Host </label>
        {user.title === "Secretary" ? (
          <HostsSelect
            handleHostChange={handleHostChange}
            hostId={formDatas.host_id}
          />
        ) : (
          <p>{staffIdToTitleAndName(staffInfos, formDatas.host_id)}</p>
        )}
      </div>
      <div className="event-form__item">
        <Input
          value={formDatas.AppointmentPurpose}
          onChange={handlePurposeChange}
          name="AppointmentPurpose"
          id="purpose"
          label="Purpose"
        />
      </div>
      <div className="event-form__item">
        <RecurrenceSelect
          value={formDatas.recurrence}
          handleRecurrenceChange={handleRecurrenceChange}
        />
      </div>
      <div className="event-form__item">
        <InputDate
          value={
            formDatas.rrule?.until ? formDatas.rrule?.until.slice(0, 10) : ""
          }
          onChange={handleUntilChange}
          id="until"
          min={timestampToDateISOTZ(formDatas.start)}
          label="Until"
        />
      </div>
    </div>
  );
};

export default EventFormHostRow;
