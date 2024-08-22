import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useMessagesExternalTemplateDelete,
  useMessagesExternalTemplatePost,
} from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageExternalTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../UI/Icons/CloneIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MessageExternalTemplateEdit from "./MessageExternalTemplateEdit";

type MessageExternalTemplateItemProps = {
  template: MessageExternalTemplateType;
  handleSelectTemplate: (template: MessageExternalTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const MessageExternalTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef,
}: MessageExternalTemplateItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  //Queries
  const messageTemplatePost = useMessagesExternalTemplatePost();
  const messageTemplateDelete = useMessagesExternalTemplateDelete();

  const handleEditClick = () => {
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

  const handleDuplicate = async (template: MessageExternalTemplateType) => {
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
        <span onClick={() => handleSelectTemplate(template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          {template.author_id === user.id && (
            <PenIcon ml={5} onClick={handleEditClick} />
          )}
          {template.author_id === user.id && (
            <TrashIcon ml={5} onClick={handleDelete} />
          )}
          <CloneIcon onClick={() => handleDuplicate(template)} ml={5} />
        </>
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT MESSAGE EXTERNAL TEMPLATE"
          width={900}
          height={550}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#93B5E9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <MessageExternalTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            template={template}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MessageExternalTemplateItem;
