
import GuestListPatientItem from "./GuestListPatientItem";
import GuestListStaffItem from "./GuestListStaffItem";

const GuestsList = ({
  formDatas,
  handleRemoveStaffGuest,
  handleRemovePatientGuest,
}) => {
  return (
    formDatas && (
      <p className="guests-list">
        {formDatas.patients_guests_ids.map(({ patient_infos }) => (
          <GuestListPatientItem
            key={patient_infos.patient_id}
            patient={patient_infos}
            handleRemovePatientGuest={handleRemovePatientGuest}
          />
        ))}
        {formDatas.staff_guests_ids.map(({ staff_infos }) => (
          <GuestListStaffItem
            key={staff_infos.id}
            staff={staff_infos}
            handleRemoveStaffGuest={handleRemoveStaffGuest}
          />
        ))}
      </p>
    )
  );
};

export default GuestsList;
