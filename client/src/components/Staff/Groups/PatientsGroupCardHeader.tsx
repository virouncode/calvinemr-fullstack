import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { DemographicsType, GroupType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { toPatientName } from "../../../utils/names/toPatientName";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PaperPlaneIcon from "../../UI/Icons/PaperPlaneIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

type PatientsGroupCardHeaderProps = {
  group: GroupType;
  handleDelete: () => void;
  handleEditClick: () => void;
  handleDuplicate: () => void;
  setInitialRecipients: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        name: string;
        email: string;
        phone: string;
      }[]
    >
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PatientsGroupCardHeader = ({
  group,
  handleDelete,
  handleEditClick,
  handleDuplicate,
  setInitialRecipients,
  setNewMessageExternalVisible,
}: PatientsGroupCardHeaderProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };

  const handleSend = () => {
    setInitialRecipients(
      (group.patients as { patient_infos: DemographicsType }[]).map(
        ({ patient_infos }) => {
          return {
            id: patient_infos.patient_id,
            name: toPatientName(patient_infos),
            email: patient_infos.Email,
            phone:
              patient_infos.PhoneNumber?.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber || "",
          };
        }
      )
    );
    setNewMessageExternalVisible(true);
  };
  return (
    <div
      className="groups__card-title"
      style={{ backgroundColor: group.color }}
    >
      <div className="groups__card-name">
        {group.name}
        {group.staff_id === user.id && (
          <PenIcon ml={10} onClick={handleEditClick} />
        )}
        <CloneIcon onClick={handleDuplicate} ml={10} />
        <PaperPlaneIcon ml={10} onClick={handleSend} />
      </div>
      <div className="groups__card-count">
        {group.staff_id === user.id && (
          <TrashIcon mr={10} onClick={handleDelete} />
        )}
        ({group.patients.length})
      </div>
    </div>
  );
};

export default PatientsGroupCardHeader;
