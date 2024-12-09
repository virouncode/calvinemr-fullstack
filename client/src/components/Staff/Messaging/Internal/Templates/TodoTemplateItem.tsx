import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useTodosTemplateDelete,
  useTodosTemplatePost,
  useTodosTemplatePut,
} from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { TodoTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../UI/Icons/CloneIcon";
import HeartIcon from "../../../../UI/Icons/HeartIcon";
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
  const templatePost = useTodosTemplatePost();
  const templateDelete = useTodosTemplateDelete();
  const templatePut = useTodosTemplatePut();

  const handleEditClick = () => {
    setEditTemplateVisible(true);
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      templateDelete.mutate(template.id, {
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
    templatePost.mutate(todoTemplateToPost);
  };

  const handleLike = async (template: TodoTemplateType) => {
    const templateToPut: TodoTemplateType = {
      ...template,
      favorites_staff_ids: template.favorites_staff_ids.includes(user.id)
        ? template.favorites_staff_ids.filter((id) => id !== user.id)
        : [...template.favorites_staff_ids, user.id],
    };
    templatePut.mutate(templateToPut);
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

        <CloneIcon onClick={() => handleDuplicate(template)} ml={5} />
        <HeartIcon
          ml={15}
          onClick={() => handleLike(template)}
          active={template.favorites_staff_ids.includes(user.id)}
        />
        {template.author_id === user.id && (
          <>
            <PenIcon ml={15} onClick={handleEditClick} />
            <TrashIcon onClick={handleDelete} ml={15} />
          </>
        )}
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT TO-DO TEMPLATE"
          width={700}
          height={500}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#8fb4fb"
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
