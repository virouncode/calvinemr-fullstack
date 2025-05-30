import { EventInput } from "@fullcalendar/core";
import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { DemographicsType, StaffType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";

type DaySheetEventCardGuestsProps = {
  event: EventInput;
};

const DaySheetEventCardGuests = ({ event }: DaySheetEventCardGuestsProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div>
      <span>
        {event.extendedProps?.patientsGuestsIds?.length
          ? (
              event.extendedProps.patientsGuestsIds as {
                patient_infos: DemographicsType;
              }[]
            ).map(
              (patient_guest) =>
                patient_guest && (
                  <span key={patient_guest.patient_infos.patient_id}>
                    <strong>
                      {toPatientName(patient_guest.patient_infos).toUpperCase()}
                    </strong>
                    {" / "}
                  </span>
                )
            )
          : null}
        {event.extendedProps?.staffGuestsIds?.length
          ? (
              event.extendedProps.staffGuestsIds as {
                staff_infos: StaffType;
              }[]
            ).map(
              (staff_guest, index) =>
                staff_guest && (
                  <span key={staff_guest.staff_infos.id}>
                    <strong>
                      {staffIdToTitleAndName(
                        staffInfos,
                        staff_guest.staff_infos.id
                      ).toUpperCase()}
                    </strong>
                    {index !== event.extendedProps?.staffGuestsIds?.length - 1
                      ? " / "
                      : ""}
                  </span>
                )
            )
          : null}
      </span>
    </div>
  );
};

export default DaySheetEventCardGuests;
