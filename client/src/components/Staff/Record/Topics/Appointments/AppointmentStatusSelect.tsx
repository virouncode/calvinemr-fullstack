import React from "react";
import StatusOption from "../../../Calendar/EventForm/Status/StatusOption";

type AppointmentStatusSelectProps = {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedStatus: string;
  statuses: string[];
  label?: boolean;
};

const AppointmentStatusSelect = ({
  handleChange,
  selectedStatus,
  statuses,
  label = false,
}: AppointmentStatusSelectProps) => {
  return (
    <>
      {label && <label htmlFor="status">Status</label>}
      <select
        name="AppointmentStatus"
        onChange={handleChange}
        value={selectedStatus}
        id="status"
      >
        {statuses.map((status) => (
          <StatusOption key={status} status={status} />
        ))}
      </select>
    </>
  );
};

export default AppointmentStatusSelect;
