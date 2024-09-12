import React from "react";
import Radio from "../../../../UI/Radio/Radio";

type StatusRadioItemProps = {
  status: string;
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStatusSelected: (status: string) => boolean;
};

const StatusRadioItem = ({
  status,
  handleStatusChange,
  isStatusSelected,
}: StatusRadioItemProps) => {
  return (
    <div className="event-form__status-radio-item">
      <Radio
        id={status}
        name="AppointmentStatus"
        value={status}
        checked={isStatusSelected(status)}
        onChange={handleStatusChange}
        label={status}
      />
    </div>
  );
};

export default StatusRadioItem;
