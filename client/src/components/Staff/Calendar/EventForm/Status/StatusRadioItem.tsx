import React from "react";
import { AppointmentType } from "../../../../../types/api";
import Radio from "../../../../UI/Radio/Radio";

type StatusRadioItemProps = {
  status: string;
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStatusSelected: (status: string) => boolean;
  formDatas: AppointmentType;
};

const StatusRadioItem = ({
  status,
  handleStatusChange,
  isStatusSelected,
  formDatas,
}: StatusRadioItemProps) => {
  return (
    <div className="event-form__status-radio-item">
      <Radio
        id={status}
        name="AppointmentStatus"
        value={status}
        checked={isStatusSelected(status)}
        onChange={handleStatusChange}
        // label={
        //   status === "Scheduled" && formDatas.invitations_sent.length > 0
        //     ? `${status}*`
        //     : status
        // }
        label={status}
      />
    </div>
  );
};

export default StatusRadioItem;
