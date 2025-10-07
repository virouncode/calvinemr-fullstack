import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useMedsTemplateDelete,
  useMedsTemplatePost,
  useMedsTemplatePut,
} from "../../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import { MedTemplateType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../../UI/Icons/CloneIcon";
import HeartIcon from "../../../../../UI/Icons/HeartIcon";
import PenIcon from "../../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import MedTemplateEdit from "./MedTemplateEdit";

type MedTemplateItemProps = {
  med: MedTemplateType;
  handleSelectTemplate: (template: MedTemplateType) => void;
  targetRef?: (node: Element | null) => void;
};

const MedTemplateItem = ({
  med,
  handleSelectTemplate,
  targetRef,
}: MedTemplateItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  //Queries
  const templatePost = useMedsTemplatePost();
  const templatePut = useMedsTemplatePut();
  const templateDelete = useMedsTemplateDelete();

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleDuplicate = async () => {
    const templateToPost = {
      ...med,
      date_created: nowTZTimestamp(),
      author_id: user.id,
    };
    templatePost.mutate(templateToPost);
  };

  const handleDelete = async (medId: number) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      templateDelete.mutate(medId);
    }
  };
  const handleLike = async (template: MedTemplateType) => {
    const templateToPut: MedTemplateType = {
      ...template,
      favorites_staff_ids: template.favorites_staff_ids.includes(user.id)
        ? template.favorites_staff_ids.filter((id) => id !== user.id)
        : [...template.favorites_staff_ids, user.id],
    };
    templatePut.mutate(templateToPut);
  };

  return (
    <>
      <li className="templates__list-item" ref={targetRef}>
        <Tooltip title={"Add to RX"} placement="top-start" arrow>
          <span
            onClick={() => handleSelectTemplate(med)}
            style={{ whiteSpace: "pre" }}
          >
            {med.PrescriptionInstructions}{" "}
            {med.author_id
              ? `(${staffIdToTitleAndName(staffInfos, med.author_id)})`
              : ""}
          </span>
        </Tooltip>
        <CloneIcon ml={10} onClick={handleDuplicate} />
        <HeartIcon
          ml={15}
          onClick={() => handleLike(med)}
          active={med.favorites_staff_ids.includes(user.id)}
        />
        {med.author_id === user.id && (
          <>
            <PenIcon ml={15} onClick={handleEdit} />
            <TrashIcon ml={15} onClick={() => handleDelete(med.id)} />
          </>
        )}
      </li>
      {editVisible && (
        <FakeWindow
          title="EDIT MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <MedTemplateEdit setEditVisible={setEditVisible} med={med} />
        </FakeWindow>
      )}
    </>
  );
};

export default MedTemplateItem;
