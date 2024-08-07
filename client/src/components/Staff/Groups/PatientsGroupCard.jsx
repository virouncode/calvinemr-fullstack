import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  usePatientsGroupDelete,
  usePatientsGroupPost,
} from "../../../hooks/reactquery/mutations/patientsGroupsMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PatientsGroupCardContent from "./PatientsGroupCardContent";
import PatientsGroupCardHeader from "./PatientsGroupCardHeader";
import PatientsGroupEdit from "./PatientsGroupEdit";

const PatientsGroupCard = ({
  group,
  global,
  setNewMessageExternalVisible,
  setInitialRecipients,
}) => {
  const { gid } = useParams();
  const [editVisible, setEditVisible] = useState(
    parseInt(gid) === group.id ? true : false
  );
  const { user } = useUserContext();
  const groupDelete = usePatientsGroupDelete(user.id, group.patients);
  const groupPost = usePatientsGroupPost(user.id);

  const handleEditClick = () => setEditVisible(true);

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this patients group ?",
      })
    ) {
      groupDelete.mutate(group.id);
    }
  };
  const handleDuplicate = async () => {
    const datasToPost = {
      ...group,
      date_created: nowTZTimestamp(),
      staff_id: user.id,
      patients: group.patients.map(
        ({ patient_infos }) => patient_infos.patient_id
      ),
    };
    groupPost.mutate(datasToPost, {
      onSuccess: () => {
        toast.success("Patients group duplicated successfully", {
          containerId: "A",
        });
      },
      onError: (err) => {
        toast.error(`Unable to duplicate patients group: ${err.message}`, {
          containerId: "A",
        });
      },
    });
  };
  return (
    <div className="patients-groups__card">
      <PatientsGroupCardHeader
        group={group}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
        handleDuplicate={handleDuplicate}
        setInitialRecipients={setInitialRecipients}
        setNewMessageExternalVisible={setNewMessageExternalVisible}
      />
      <PatientsGroupCardContent group={group} />
      {editVisible && (
        <FakeWindow
          title={`EDIT ${group.name}`}
          width={500}
          height={670}
          x={100}
          y={(window.innerHeight - 670) / 2}
          color={group.color}
          setPopUpVisible={setEditVisible}
          textColor="#3D3759"
        >
          <PatientsGroupEdit
            setEditVisible={setEditVisible}
            group={group}
            global={global}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default PatientsGroupCard;
