
import StatusOption from "./StatusOption";

const StatusSelect = ({
  handleChange,
  selectedStatus,
  statuses,
  label = true,
}) => {
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

export default StatusSelect;
