import StatusOption from "../../../EventForm/Status/StatusOption";

const AppointmentStatusSelectToggle = ({
  handleChange,
  selectedStatus,
  statuses,
  label = false,
  editVisible,
}) => {
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
