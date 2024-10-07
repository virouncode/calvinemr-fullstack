import { EventInput } from "@fullcalendar/core";
import React from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { AppointmentType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Button from "../../../UI/Buttons/Button";
import CancelButton from "../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../UI/Buttons/DeleteButton";
import SubmitButton from "../../../UI/Buttons/SubmitButton";

type EventFormButtonsProps = {
  formDatas: AppointmentType;
  currentEvent: React.MutableRefObject<EventInput | null>;
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleInvitation: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  progress: boolean;
  handleDeleteEvent: () => void;
};

const EventFormButtons = ({
  formDatas,
  currentEvent,
  handleCancel,
  handleInvitation,
  progress,
  handleDeleteEvent,
}: EventFormButtonsProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  return (
    <div className="event-form__btns">
      {/* {user.title === "Secretary" ||
      currentEvent.current?.extendedProps?.host === user.id ? (
        <> */}
      <SubmitButton label="Save" />
      <CancelButton onClick={handleCancel} disabled={progress} />
      <Button
        onClick={handleInvitation}
        disabled={
          (!formDatas.staff_guests_ids?.length &&
            !formDatas.patients_guests_ids?.length) ||
          !formDatas.host_id ||
          progress
        }
        label="Send Invitation"
      />
      <DeleteButton onClick={handleDeleteEvent} disabled={progress} />
      {/* </>
      ) : (
        <CloseButton onClick={handleCancel} disabled={progress} />
      )} */}
    </div>
  );
};

export default EventFormButtons;
