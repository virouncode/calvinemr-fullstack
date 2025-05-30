import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useMessagesExternalTemplateDelete,
  useMessagesExternalTemplatePost,
  useMessagesExternalTemplatePut,
} from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageExternalTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../UI/Icons/CloneIcon";
import HeartIcon from "../../../../UI/Icons/HeartIcon";
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
  const templatePost = useMessagesExternalTemplatePost();
  const templateDelete = useMessagesExternalTemplateDelete();
  const templatePut = useMessagesExternalTemplatePut();

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

  const handleDuplicate = async (template: MessageExternalTemplateType) => {
    const messageTemplateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(messageTemplateToPost);
  };

  const handleLike = async (template: MessageExternalTemplateType) => {
    const templateToPut: MessageExternalTemplateType = {
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
        <>
          <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
          <HeartIcon
            ml={15}
            onClick={() => handleLike(template)}
            active={template.favorites_staff_ids.includes(user.id)}
          />
          {template.author_id === user.id && (
            <>
              <PenIcon ml={15} onClick={handleEditClick} />
              <TrashIcon ml={15} onClick={handleDelete} />
            </>
          )}
        </>
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT MESSAGE EXTERNAL TEMPLATE"
          width={700}
          height={550}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#8fb4fb"
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
