import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useTodosTemplateDelete,
  useTodosTemplatePost,
} from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { TodoTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../UI/Icons/CloneIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import TodoTemplateEdit from "./TodoTemplateEdit";

type TodoTemplateItemProps = {
  template: TodoTemplateType;
  handleSelectTemplate: (template: TodoTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const TodoTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef,
}: TodoTemplateItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  //Queries
  const todoTemplatePost = useTodosTemplatePost();
  const todoTemplateDelete = useTodosTemplateDelete();

  const handleEditClick = () => {
    setEditTemplateVisible(true);
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      todoTemplateDelete.mutate(template.id, {
        onSuccess: () => {
          setEditTemplateVisible(false);
        },
      });
    }
  };

  const handleDuplicate = async (template: TodoTemplateType) => {
    const todoTemplateToPost: Partial<TodoTemplateType> = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    todoTemplatePost.mutate(todoTemplateToPost);
  };

  return (
    <>
      <li className="templates__list-item" key={template.id} ref={lastItemRef}>
        <span onClick={() => handleSelectTemplate(template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          <CloneIcon onClick={() => handleDuplicate(template)} ml={5} />
          {template.author_id === user.id && (
            <PenIcon ml={15} onClick={handleEditClick} />
          )}
          {template.author_id === user.id && (
            <TrashIcon onClick={handleDelete} ml={15} />
          )}
        </>
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT TO-DO TEMPLATE"
          width={700}
          height={500}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93B5E9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <TodoTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            template={template}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default TodoTemplateItem;
