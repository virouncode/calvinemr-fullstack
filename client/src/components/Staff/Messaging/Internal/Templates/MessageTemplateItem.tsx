import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useMessagesTemplateDelete,
  useMessagesTemplatePost,
  useMessagesTemplatePut,
} from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../UI/Icons/CloneIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MessageTemplateEdit from "./MessageTemplateEdit";
import MessageTemplateEditMobile from "./MessageTemplateEditMobile";
import HeartIcon from "../../../../UI/Icons/HeartIcon";

type MessageTemplateItemProps = {
  template: MessageTemplateType;
  handleSelectTemplate: (template: MessageTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const MessageTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef,
}: MessageTemplateItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const templatePost = useMessagesTemplatePost();
  const templateDelete = useMessagesTemplateDelete();
  const templatePut = useMessagesTemplatePut();

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

  const handleDuplicate = async (template: MessageTemplateType) => {
    const messageTemplateToPost: Partial<MessageTemplateType> = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(messageTemplateToPost);
  };

  const handleLike = async (template: MessageTemplateType) => {
    const templateToPut: MessageTemplateType = {
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
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT MESSAGE TEMPLATE"
          width={900}
          height={630}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#8fb4fb"
          setPopUpVisible={setEditTemplateVisible}
        >
          {isTabletOrMobile ? (
            <MessageTemplateEditMobile
              setEditTemplateVisible={setEditTemplateVisible}
              template={template}
            />
          ) : (
            <MessageTemplateEdit
              setEditTemplateVisible={setEditTemplateVisible}
              template={template}
            />
          )}
        </FakeWindow>
      )}
    </>
  );
};

export default MessageTemplateItem;
