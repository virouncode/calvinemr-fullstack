import React from "react";
import StatusRadioItem from "./Status/StatusRadioItem";

type EventFormStatusProps = {
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string;
  statuses: string[];
  label?: boolean;
};

const EventFormStatus = ({
  handleStatusChange,
  selectedStatus,
  statuses,
  label = true,
}: EventFormStatusProps) => {
  const isStatusSelected = (status: string) => selectedStatus === status;

  return (
    <div className="event-form__row event-form__row--radio">
      <div className="event-form__radio-container">
        {label && <label className="event-form__radio-title">Status</label>}
        <ul>
          {statuses.map((status) => (
            <StatusRadioItem
              key={status}
              status={status}
              handleStatusChange={handleStatusChange}
              isStatusSelected={isStatusSelected}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventFormStatus;
