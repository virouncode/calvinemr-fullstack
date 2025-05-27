import { EventContentArg } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { DemographicsType, StaffType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PhoneIcon from "../../UI/Icons/PhoneIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import UserIcon from "../../UI/Icons/UserIcon";
import VideoIcon from "../../UI/Icons/VideoIcon";

type EventElementProps = {
  event: EventImpl;
  info: EventContentArg;
  handleCopyEvent: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    info: EventContentArg
  ) => void;
  handleDeleteEvent: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    info: EventContentArg
  ) => void;
  handlePatientClick: (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.TouchEvent<HTMLSpanElement>,
    patientId: number
  ) => void;
  patientsGuestsIds: { patient_infos: DemographicsType }[];
  staffGuestsIds: { staff_infos: StaffType }[];
};

const EventElement = ({
  event,
  info,
  handleCopyEvent,
  handleDeleteEvent,
  handlePatientClick,
  patientsGuestsIds,
  staffGuestsIds,
}: EventElementProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="calendar__event-element"
      style={{
        backgroundImage:
          event.extendedProps.status === "Cancelled"
            ? `repeating-linear-gradient(
          45deg,
          ${event.backgroundColor},
          ${event.backgroundColor} 10px,
          #aaaaaa 10px,
          #aaaaaa 20px
        )`
            : undefined,
      }}
    >
      <div className="calendar__event-element-row">
        <div className="calendar__event-element-time">
          {event.allDay ? "All Day" : info.timeText}
        </div>
        <div className="calendar__event-element-reason">
          <div className="calendar__event-element-purpose">
            {event.extendedProps.appointment_type === "visio" ? (
              <VideoIcon mr={5} />
            ) : event.extendedProps.appointment_type === "phone" ? (
              <PhoneIcon mr={5} />
            ) : event.extendedProps.appointment_type === "in-person" ? (
              <UserIcon mr={5} />
            ) : null}
            {/* {event.extendedProps.purpose ?? "Appointment"} */}
          </div>
          {/* {(event.extendedProps.host === user.id ||
            user.title === "Secretary") && ( */}
          <div className="calendar__event-element-btns">
            <CloneIcon
              ml={5}
              mr={5}
              onClick={(e) => handleCopyEvent(e, info)}
            />
            <TrashIcon
              onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
                handleDeleteEvent(e, info)
              }
            />
          </div>
          {/* )} */}
        </div>
      </div>
      <div className="calendar__event-element-guests">
        <span>
          {patientsGuestsIds.length > 0 &&
            patientsGuestsIds.map(
              (patient_guest) =>
                patient_guest && (
                  <span
                    className="calendar__patient-link"
                    onClick={(e) =>
                      handlePatientClick(
                        e,
                        patient_guest.patient_infos.patient_id
                      )
                    }
                    onTouchEnd={(e) => {
                      handlePatientClick(
                        e,
                        patient_guest.patient_infos.patient_id
                      );
                    }}
                    key={patient_guest.patient_infos.patient_id}
                  >
                    <strong>
                      {toPatientName(patient_guest.patient_infos).toUpperCase()}
                    </strong>
                    {" / "}
                  </span>
                )
            )}
          {staffGuestsIds.length > 0 &&
            staffGuestsIds.map(
              (staff_guest, index) =>
                staff_guest && (
                  <span key={staff_guest.staff_infos.id}>
                    <strong>
                      {staffIdToTitleAndName(
                        staffInfos,
                        staff_guest.staff_infos.id
                      ).toUpperCase()}
                    </strong>
                    {index !== staffGuestsIds.length - 1 ? " / " : ""}
                  </span>
                )
            )}
        </span>
      </div>
      <div className="calendar__event-element-infos">
        <div>
          <strong>Host: </strong>
          {event.extendedProps.hostName}
        </div>
        <div>
          <strong>Site: </strong>
          {event.extendedProps.siteName}
        </div>
        <div>
          <strong>Room: </strong>
          {event.extendedProps.roomTitle}
        </div>
        <div>
          <strong>{event.extendedProps.status?.toUpperCase()}</strong>
        </div>
      </div>
    </div>
  );
};

export default EventElement;
