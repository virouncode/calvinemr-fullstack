import { useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useTodosTemplateDelete,
  useTodosTemplatePost,
} from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import TodoTemplateEdit from "./TodoTemplateEdit";

const TodoTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const todoTemplatePost = useTodosTemplatePost();
  const todoTemplateDelete = useTodosTemplateDelete();

  const handleEditClick = (e) => {
    e.preventDefault();
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

  const handleDuplicate = async (e, template) => {
    const todoTemplateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    todoTemplatePost.mutate(todoTemplateToPost);
  };

  return (
    <>
      <li
        className="messages__templates-list-item"
        key={template.id}
        ref={lastItemRef}
      >
        <span onClick={(e) => handleSelectTemplate(e, template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          {template.author_id === user.id && (
            <i
              className="fa-regular fa-pen-to-square"
              style={{ cursor: "pointer", marginLeft: "5px" }}
              onClick={handleEditClick}
            ></i>
          )}
          {template.author_id === user.id && (
            <i
              className="fa-solid fa-trash"
              onClick={handleDelete}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            ></i>
          )}
          <i
            className="fa-solid fa-clone"
            onClick={(e) => handleDuplicate(e, template)}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          ></i>
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
