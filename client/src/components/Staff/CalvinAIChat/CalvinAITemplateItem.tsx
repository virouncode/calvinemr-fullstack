import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useCalvinAITemplateDelete,
  useCalvinAITemplatePost,
} from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { CalvinAITemplateType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

type CalvinAITemplateItemProps = {
  template: CalvinAITemplateType;
  handleSelectTemplate: (template: CalvinAITemplateType) => void;
  handleEdit: (templateId: number) => void;
  lastItemRef?: (node: Element | null) => void;
};

const CalvinAITemplateItem = ({
  template,
  handleSelectTemplate,
  handleEdit,
  lastItemRef,
}: CalvinAITemplateItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();

  const templateDelete = useCalvinAITemplateDelete();
  const templatePost = useCalvinAITemplatePost();

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      templateDelete.mutate(template.id);
    }
  };

  const handleDuplicate = async (template: CalvinAITemplateType) => {
    const templateToPost: CalvinAITemplateType = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(templateToPost);
  };

  return (
    <li className="calvinai__templates-list-item" ref={lastItemRef}>
      <span onClick={() => handleSelectTemplate(template)}>
        {template.name}{" "}
        {template.author_id
          ? `(${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      {user.id === template.author_id && (
        <>
          <PenIcon ml={5} onClick={() => handleEdit(template.id)} />
          <TrashIcon ml={5} onClick={handleDelete} />
        </>
      )}
      <CloneIcon onClick={() => handleDuplicate(template)} ml={5} />
    </li>
  );
};

export default CalvinAITemplateItem;
