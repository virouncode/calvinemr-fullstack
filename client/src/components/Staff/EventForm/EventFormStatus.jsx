import StatusRadioItem from "./Status/StatusRadioItem";

const EventFormStatus = ({
  handleStatusChange,
  selectedStatus,
  statuses,
  label = true,
}) => {
  const isStatusSelected = (status) => selectedStatus === status;
  return (
    <div className="event-form__row event-form__row--radio">
      {label && <p>Status</p>}
      <div className="event-form__radio-container">
        {statuses.map((status) => (
          <StatusRadioItem
            key={status}
            status={status}
            handleStatusChange={handleStatusChange}
            isStatusSelected={isStatusSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default EventFormStatus;
