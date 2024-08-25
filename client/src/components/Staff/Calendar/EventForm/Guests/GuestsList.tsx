import React from "react";
import {
  AppointmentType,
  DemographicsType,
  StaffType,
} from "../../../../../types/api";
import GuestListPatientItem from "./GuestListPatientItem";
import GuestListStaffItem from "./GuestListStaffItem";

type GuestsListProps = {
  formDatas: AppointmentType;
  handleRemoveStaffGuest: (staff: StaffType) => void;
  handleRemovePatientGuest: (patient: DemographicsType) => void;
};

const GuestsList = ({
  formDatas,
  handleRemoveStaffGuest,
  handleRemovePatientGuest,
}: GuestsListProps) => {
  return (
    formDatas && (
      <p className="guests-list">
        {(
          formDatas.patients_guests_ids as { patient_infos: DemographicsType }[]
        ).map(({ patient_infos }) => (
          <GuestListPatientItem
            key={patient_infos.patient_id}
            patient={patient_infos}
            handleRemovePatientGuest={handleRemovePatientGuest}
          />
        ))}
        {(formDatas.staff_guests_ids as { staff_infos: StaffType }[]).map(
          ({ staff_infos }) => (
            <GuestListStaffItem
              key={staff_infos.id}
              staff={staff_infos}
              handleRemoveStaffGuest={handleRemoveStaffGuest}
            />
          )
        )}
      </p>
    )
  );
};

export default GuestsList;
