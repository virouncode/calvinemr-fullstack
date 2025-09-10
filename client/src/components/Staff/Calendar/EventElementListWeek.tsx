import { EventContentArg } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
import React from "react";
import usePurposesContext from "../../../hooks/context/usePuposesContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { DemographicsType, StaffType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PhoneIcon from "../../UI/Icons/PhoneIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import UserIcon from "../../UI/Icons/UserIcon";
import VideoIcon from "../../UI/Icons/VideoIcon";

type EventElementListWeekProps = {
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

const EventElementListWeek = ({
  event,
  info,
  handleCopyEvent,
  handleDeleteEvent,
  handlePatientClick,
  patientsGuestsIds,
  staffGuestsIds,
}: EventElementListWeekProps) => {
  //Hooks
  const { purposes } = usePurposesContext();
  const { staffInfos } = useStaffInfosContext();

  const purposesNames: string | null =
    event.extendedProps.purposes_ids?.length > 0
      ? event.extendedProps.purposes_ids
          .map((id: number) => {
            const purpose = purposes.find((purpose) => purpose.id === id);
            return purpose ? purpose.name : null;
          })
          .filter((name: string | null) => name !== null)
          .join(" - ")
      : null;

  return (
    <div
      className="calendar__event-element-list"
      style={{
        backgroundImage:
          event.extendedProps.status === "Cancelled" ||
          event.extendedProps.status === "Scheduled"
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
      <div className="calendar__event-element-list-infos">
        <div>
          {event.extendedProps.appointment_type === "visio" ? (
            <VideoIcon mr={5} />
          ) : event.extendedProps.appointment_type === "phone" ? (
            <PhoneIcon mr={5} />
          ) : event.extendedProps.appointment_type === "in-person" ? (
            <UserIcon mr={5} />
          ) : null}
          <strong>{purposesNames ?? "Appointment"}</strong>
        </div>
        <div>
          <span>
            {patientsGuestsIds.length > 0 &&
              patientsGuestsIds.map(
                (patient_guest) =>
                  patient_guest && (
                    <span
                      className="calendar__patient-link calendar__patient-link--list"
                      onClick={(e) =>
                        handlePatientClick(
                          e,
                          patient_guest.patient_infos.patient_id
                        )
                      }
                      onTouchEnd={(e) =>
                        handlePatientClick(
                          e,
                          patient_guest.patient_infos.patient_id
                        )
                      }
                      key={patient_guest.patient_infos.patient_id}
                    >
                      <strong>
                        {toPatientName(
                          patient_guest.patient_infos
                        ).toUpperCase()}
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
          {event.extendedProps.rommTitle}
        </div>
        <div>
          <strong>{event.extendedProps.status?.toUpperCase()}</strong>
        </div>
        {event.extendedProps.notes && (
          <div>
            <strong>Notes: </strong>
            {event.extendedProps.notes}
          </div>
        )}
      </div>
      <div className="calendar__event-element-list-btns">
        {/* {(event.extendedProps.host === user.id ||
          user.title === "Secretary") && ( */}
        <div>
          <CloneIcon ml={5} mr={5} onClick={(e) => handleCopyEvent(e, info)} />
          <TrashIcon onClick={(e) => handleDeleteEvent(e, info)} />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default EventElementListWeek;
