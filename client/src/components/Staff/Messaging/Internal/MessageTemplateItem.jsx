import { useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagesTemplateDelete,
  useMessagesTemplatePost,
} from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageTemplateEdit from "./MessageTemplateEdit";

const MessageTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const messageTemplatePost = useMessagesTemplatePost();
  const messageTemplateDelete = useMessagesTemplateDelete();

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
      messageTemplateDelete.mutate(template.id, {
        onSuccess: () => {
          setEditTemplateVisible(false);
        },
      });
    }
  };

  const handleDuplicate = async (e, template) => {
    const messageTemplateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    messageTemplatePost.mutate(messageTemplateToPost);
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
              className="fa-solid fa-pen-to-square"
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
          title="EDIT MESSAGE TEMPLATE"
          width={900}
          height={550}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#93B5E9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <MessageTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            template={template}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MessageTemplateItem;
