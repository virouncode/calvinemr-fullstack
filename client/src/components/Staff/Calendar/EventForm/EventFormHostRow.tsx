import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { AppointmentType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";
import Input from "../../../UI/Inputs/Input";
import InputDate from "../../../UI/Inputs/InputDate";
import HostsSelect from "./Host/HostsSelect";
import RecurrenceSelect from "./RecurrenceSelect";

type EventFormHostRowProps = {
  formDatas: AppointmentType;
  handleHostChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePurposeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRecurrenceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleUntilChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EventFormHostRow = ({
  formDatas,
  handleHostChange,
  handlePurposeChange,
  handleRecurrenceChange,
  handleUntilChange,
}: EventFormHostRowProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="event-form__host">
      <div className="event-form__host-item">
        <label>Host </label>
        <HostsSelect
          handleHostChange={handleHostChange}
          hostId={formDatas.host_id}
          disabled={user.title !== "Secretary" && user.title !== "Nurse"}
        />
      </div>
      <div className="event-form__host-item">
        <Input
          value={formDatas.AppointmentPurpose}
          onChange={handlePurposeChange}
          name="AppointmentPurpose"
          id="purpose"
          label="Purpose"
        />
      </div>
      <div className="event-form__host-item">
        <RecurrenceSelect
          value={formDatas.recurrence}
          handleRecurrenceChange={handleRecurrenceChange}
        />
      </div>
      <div className="event-form__host-item">
        <InputDate
          value={
            formDatas.rrule?.until ? formDatas.rrule?.until.slice(0, 10) : ""
          }
          onChange={handleUntilChange}
          id="until"
          min={timestampToDateISOTZ(formDatas.end)}
          label="Until"
          disabled={formDatas.recurrence === "Once"}
        />
      </div>
    </div>
  );
};

export default EventFormHostRow;
