import StatusOption from "../../../Calendar/EventForm/Status/StatusOption";

const AppointmentStatusSelect = ({
  handleChange,
  selectedStatus,
  statuses,
  label = false,
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

export default AppointmentStatusSelect;
