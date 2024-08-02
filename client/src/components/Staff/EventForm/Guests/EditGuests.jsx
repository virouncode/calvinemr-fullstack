
import GuestsList from "./GuestsList";
import GuestsSearch from "./GuestsSearch";

const EditGuests = ({ formDatas, setFormDatas, editable, hostId }) => {
  //=========================== HOOKS =========================//
  const patientsIdsToExclude = formDatas.patients_guests_ids.map(
    ({ patient_infos }) => patient_infos.patient_id
  );
  // //========================== EVENTS HANDLERS =======================//

  const handleAddStaffGuest = (e, staff) => {
    setFormDatas({
      ...formDatas,
      staff_guests_ids: [
        ...formDatas.staff_guests_ids,
        { staff_infos: { ...staff } },
      ],
    });
  };

  const handleAddPatientGuest = (e, patient) => {
    setFormDatas({
      ...formDatas,
      patients_guests_ids: [
        ...formDatas.patients_guests_ids,
        { patient_infos: { ...patient } },
      ],
    });
  };

  const handleRemovePatientGuest = (e, patient) => {
    setFormDatas({
      ...formDatas,
      patients_guests_ids: formDatas.patients_guests_ids.filter(
        ({ patient_infos }) => patient_infos.patient_id !== patient.patient_id
      ),
    });
  };
  const handleRemoveStaffGuest = (e, staff) => {
    setFormDatas({
      ...formDatas,
      staff_guests_ids: formDatas.staff_guests_ids.filter(
        ({ staff_infos }) => staff_infos.id !== staff.id
      ),
    });
  };

  return (
    <>
      <div className="event-form__item event-form__item--guestlist">
        <label>Patients/Guests: </label>
        <GuestsList
          formDatas={formDatas}
          handleRemoveStaffGuest={handleRemoveStaffGuest}
          handleRemovePatientGuest={handleRemovePatientGuest}
        />
      </div>
      {editable && (
        <div className="event-form__item event-form__item--guestsearch">
          <GuestsSearch
            hostId={hostId}
            staff_guests_ids={formDatas.staff_guests_ids}
            handleAddPatientGuest={handleAddPatientGuest}
            handleAddStaffGuest={handleAddStaffGuest}
            patientsIdsToExclude={patientsIdsToExclude}
          />
        </div>
      )}
    </>
  );
};

export default EditGuests;
