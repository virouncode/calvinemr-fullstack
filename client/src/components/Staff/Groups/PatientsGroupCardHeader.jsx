import useUserContext from "../../../hooks/context/useUserContext";
import { toPatientName } from "../../../utils/names/toPatientName";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PaperPlaneIcon from "../../UI/Icons/PaperPlaneIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

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
          <PenIcon ml={5} onClick={handleEditClick} />
        )}
        <CloneIcon onClick={handleDuplicate} ml={5} />
        <PaperPlaneIcon ml={5} onClick={handleSend} />
      </div>
      <div className="patients-groups__card-count">
        {group.staff_id === user.id && (
          <TrashIcon mr={5} onClick={handleDelete} />
        )}
        ({group.patients.length})
      </div>
    </div>
  );
};

export default PatientsGroupCardHeader;
