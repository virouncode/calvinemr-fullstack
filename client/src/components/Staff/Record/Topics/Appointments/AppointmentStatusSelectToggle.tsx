import React from "react";
import StatusOption from "../../../Calendar/EventForm/Status/StatusOption";

type AppointmentStatusSelectToggleProps = {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedStatus: string;
  statuses: string[];
  label?: boolean;
  editVisible: boolean;
};

const AppointmentStatusSelectToggle = ({
  handleChange,
  selectedStatus,
  statuses,
  label = false,
  editVisible,
}: AppointmentStatusSelectToggleProps) => {
  return (
    <>
      {label && <label htmlFor="status">Status</label>}
      {editVisible ? (
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
      ) : (
        <p>{selectedStatus}</p>
      )}
    </>
  );
};

export default AppointmentStatusSelectToggle;
