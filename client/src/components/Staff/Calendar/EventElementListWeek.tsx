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
import TrashIcon from "../../UI/Icons/TrashIcon";

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
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
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
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      style={{
        height: "100%",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            padding: "0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          <strong>
            {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
          </strong>
        </p>
        {(event.extendedProps.host === user.id ||
          user.title === "Secretary") && (
          <div>
            <CloneIcon
              ml={5}
              mr={5}
              onClick={(e) => handleCopyEvent(e, info)}
            />
            <TrashIcon onClick={(e) => handleDeleteEvent(e, info)} />
          </div>
        )}
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
  );
};

export default EventElementListWeek;
