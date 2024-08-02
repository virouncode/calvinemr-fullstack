
import useUserContext from "../../../hooks/context/useUserContext";
import { toPatientName } from "../../../utils/names/toPatientName";

const PatientsGroupCardHeader = ({
  group,
  handleDelete,
  handleEditClick,
  handleDuplicate,
  setInitialRecipients,
  setNewMessageExternalVisible,
}) => {
  const { user } = useUserContext();
  const handleSend = () => {
    setInitialRecipients(
      group.patients.map(({ patient_infos }) => {
        return {
          id: patient_infos.patient_id,
          name: toPatientName(patient_infos),
          email: patient_infos.Email,
          phone:
            patient_infos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber || "",
        };
      })
    );
    setNewMessageExternalVisible(true);
  };
  return (
    <div
      className="patients-groups__card-title"
      style={{ backgroundColor: group.color }}
    >
      <div className="patients-groups__card-name">
        {group.name}
        {group.staff_id === user.id && (
          <i
            className="fa-solid fa-pen-to-square"
            style={{ marginLeft: "5px", cursor: "pointer" }}
            onClick={handleEditClick}
          />
        )}
        <i
          className="fa-solid fa-clone"
          onClick={handleDuplicate}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        />
        <i
          className="fa-regular fa-paper-plane"
          style={{ cursor: "pointer", marginLeft: "5px" }}
          onClick={handleSend}
        />
      </div>
      <div className="patients-groups__card-count">
        {group.staff_id === user.id && (
          <i
            className="fa-solid fa-trash"
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={handleDelete}
          />
        )}
        ({group.patients.length})
      </div>
    </div>
  );
};

export default PatientsGroupCardHeader;
