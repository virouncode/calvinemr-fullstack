import Radio from "../../../UI/Radio/Radio";

const StatusRadioItem = ({ status, handleStatusChange, isStatusSelected }) => {
  return (
    <div className="event-form__item event-form__item--radio">
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
