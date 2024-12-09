import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useCalvinAITemplateDelete,
  useCalvinAITemplatePost,
  useCalvinAITemplatePut,
} from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { CalvinAITemplateType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../UI/Icons/CloneIcon";
import HeartIcon from "../../UI/Icons/HeartIcon";
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
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  //Queries
  const templateDelete = useCalvinAITemplateDelete();
  const templatePost = useCalvinAITemplatePost();
  const templatePut = useCalvinAITemplatePut();

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

  const handleLike = async (template: CalvinAITemplateType) => {
    const templateToPut: CalvinAITemplateType = {
      ...template,
      favorites_staff_ids: template.favorites_staff_ids.includes(user.id)
        ? template.favorites_staff_ids.filter((id) => id !== user.id)
        : [...template.favorites_staff_ids, user.id],
    };
    templatePut.mutate(templateToPut);
  };

  return (
    <li className="templates__list-item" ref={lastItemRef}>
      <span onClick={() => handleSelectTemplate(template)}>
        {template.name}{" "}
        {template.author_id
          ? `(${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
      <HeartIcon
        ml={15}
        onClick={() => handleLike(template)}
        active={template.favorites_staff_ids.includes(user.id)}
      />
      {user.id === template.author_id && (
        <>
          <PenIcon ml={15} onClick={() => handleEdit(template.id)} />
          <TrashIcon ml={15} onClick={handleDelete} />
        </>
      )}
    </li>
  );
};

export default CalvinAITemplateItem;
