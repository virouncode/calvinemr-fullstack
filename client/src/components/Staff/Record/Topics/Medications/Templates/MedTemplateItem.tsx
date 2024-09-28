import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useMedsTemplateDelete,
  useMedsTemplatePost,
} from "../../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import { MedTemplateType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../../UI/Icons/CloneIcon";
import PenIcon from "../../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import MedTemplateEdit from "./MedTemplateEdit";

type MedTemplateItemProps = {
  med: MedTemplateType;
  handleSelectTemplate: (template: MedTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const MedTemplateItem = ({
  med,
  handleSelectTemplate,
  lastItemRef,
}: MedTemplateItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  //Queries
  const medTemplatePost = useMedsTemplatePost();
  const medTemplateDelete = useMedsTemplateDelete();

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleDuplicate = async () => {
    const templateToPost = {
      ...med,
      date_created: nowTZTimestamp(),
      author_id: user.id,
    };
    medTemplatePost.mutate(templateToPost);
  };

  const handleDelete = async (medId: number) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      medTemplateDelete.mutate(medId);
    }
  };

  return (
    <>
      <li className="templates__list-item" ref={lastItemRef}>
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
        <Tooltip title="Duplicate" placement="top-start" arrow>
          <span>
            <CloneIcon ml={10} onClick={handleDuplicate} />
          </span>
        </Tooltip>
        {med.author_id === user.id && <PenIcon ml={15} onClick={handleEdit} />}
        {med.author_id === user.id && (
          <span>
            <TrashIcon ml={15} onClick={() => handleDelete(med.id)} />
          </span>
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
