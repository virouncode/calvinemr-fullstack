import useUserContext from "../../../hooks/context/useUserContext";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import CloseButton from "../../UI/Buttons/CloseButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";

const EventFormButtons = ({
  formDatas,
  currentEvent,
  handleCancel,
  handleInvitation,
  progress,
}) => {
  const { user } = useUserContext();
  return (
    <div className="event-form__btns">
      {user.title === "Secretary" ||
      currentEvent.current.extendedProps.host === user.id ? (
        <>
          <SubmitButton label="Save" />
          <CancelButton onClick={handleCancel} disabled={progress} />
          <Button
            onClick={handleInvitation}
            disabled={
              (!formDatas.staff_guests_ids.length &&
                !formDatas.patients_guests_ids.length) ||
              !formDatas.host_id ||
              progress
            }
            label="Send Invitation"
          />
        </>
      ) : (
        <CloseButton onClick={handleCancel} disabled={progress} />
      )}
    </div>
  );
};

export default EventFormButtons;
