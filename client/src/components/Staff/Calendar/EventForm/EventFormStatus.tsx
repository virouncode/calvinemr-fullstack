import React from "react";
import { AppointmentType } from "../../../../types/api";
import StatusRadioItem from "./Status/StatusRadioItem";

type EventFormStatusProps = {
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string;
  statuses: string[];
  label?: boolean;
  formDatas: AppointmentType;
};

const EventFormStatus = ({
  handleStatusChange,
  selectedStatus,
  statuses,
  label = true,
  formDatas,
}: EventFormStatusProps) => {
  const isStatusSelected = (status: string) => selectedStatus === status;

  return (
    <div className="event-form__status">
      <div className="event-form__status-radio">
        {label && (
          <label className="event-form__status-radio-title">Status</label>
        )}
        <ul>
          {statuses.map((status) => (
            <StatusRadioItem
              key={status}
              status={status}
              handleStatusChange={handleStatusChange}
              isStatusSelected={isStatusSelected}
              formDatas={formDatas}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventFormStatus;
