import React from "react";
import {
  AppointmentType,
  DemographicsType,
  StaffType,
} from "../../../../types/api";
import GuestsList from "./Guests/GuestsList";
import GuestsSearch from "./Guests/GuestsSearch";

type EventFormGuestsProps = {
  formDatas: AppointmentType;
  setFormDatas: React.Dispatch<React.SetStateAction<AppointmentType>>;
  editable: boolean;
  hostId: number;
};
const EventFormGuests = ({
  formDatas,
  setFormDatas,
  editable,
  hostId,
}: EventFormGuestsProps) => {
  //=========================== HOOKS =========================//
  const patientsIdsToExclude = (
    formDatas.patients_guests_ids as { patient_infos: DemographicsType }[]
  ).map(({ patient_infos }) => patient_infos.patient_id);
  //========================== EVENTS HANDLERS =======================//

  const handleAddStaffGuest = (staff: StaffType) => {
    setFormDatas({
      ...formDatas,
      staff_guests_ids: [
        ...(formDatas.staff_guests_ids as { staff_infos: StaffType }[]),
        { staff_infos: { ...staff } },
      ],
    });
  };

  const handleAddPatientGuest = (patient: DemographicsType) => {
    setFormDatas({
      ...formDatas,
      patients_guests_ids: [
        ...(formDatas.patients_guests_ids as {
          patient_infos: DemographicsType;
        }[]),
        { patient_infos: { ...patient } },
      ],
    });
  };

  const handleRemovePatientGuest = (patient: DemographicsType) => {
    setFormDatas({
      ...formDatas,
      patients_guests_ids: (
        formDatas.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) => patient_infos.patient_id !== patient.patient_id
      ),
    });
  };
  const handleRemoveStaffGuest = (staff: StaffType) => {
    setFormDatas({
      ...formDatas,
      staff_guests_ids: (
        formDatas.staff_guests_ids as { staff_infos: StaffType }[]
      ).filter(({ staff_infos }) => staff_infos.id !== staff.id),
    });
  };

  return (
    <div className="event-form__guests">
      <div className="event-form__guests-list">
        <label>Patients/Guests</label>
        <GuestsList
          formDatas={formDatas}
          handleRemoveStaffGuest={handleRemoveStaffGuest}
          handleRemovePatientGuest={handleRemovePatientGuest}
        />
      </div>
      {editable && (
        <div className="event-form__guests-search">
          <GuestsSearch
            hostId={hostId}
            staff_guests_ids={
              formDatas.staff_guests_ids as { staff_infos: StaffType }[]
            }
            handleAddPatientGuest={handleAddPatientGuest}
            handleAddStaffGuest={handleAddStaffGuest}
            patientsIdsToExclude={patientsIdsToExclude}
            invitationsSent={formDatas.invitations_sent}
          />
        </div>
      )}
    </div>
  );
};

export default EventFormGuests;
