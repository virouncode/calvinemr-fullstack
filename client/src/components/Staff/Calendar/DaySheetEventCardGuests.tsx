import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { EventType } from "../../../types/app";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";

type DaySheetEventCardGuestsProps = {
  event: EventType;
};

const DaySheetEventCardGuests = ({ event }: DaySheetEventCardGuestsProps) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div>
      <span>
        {event.extendedProps.patientsGuestsIds?.length
          ? event.extendedProps.patientsGuestsIds.map(
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
        {event.extendedProps.staffGuestsIds?.length
          ? event.extendedProps.staffGuestsIds.map(
              (staff_guest, index) =>
                staff_guest && (
                  <span key={staff_guest.staff_infos.id}>
                    <strong>
                      {staffIdToTitleAndName(
                        staffInfos,
                        staff_guest.staff_infos.id
                      ).toUpperCase()}
                    </strong>
                    {index !== event.extendedProps.staffGuestsIds?.length - 1
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
