import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useMessagesExternalTemplatePost } from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageExternalTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";

type MessageExternalTemplateFormProps = {
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageExternalTemplateForm = ({
  setNewTemplateVisible,
}: MessageExternalTemplateFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  //Queries
  const messageTemplatePost = useMessagesExternalTemplatePost();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleCancel = () => {
    setNewTemplateVisible(false);
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Template name field is required", { containerId: "A" });
      return;
    }
    if (!body) {
      toast.error("Your template body is empty", { containerId: "A" });
      return;
    }
    setProgress(true);
    //create the message template
    const messageTemplateToPost: Partial<MessageExternalTemplateType> = {
      name: name,
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
      favorites_staff_ids: [user.id],
    };
    messageTemplatePost.mutate(messageTemplateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <div className="message-template__form">
      <div className="message-template__form-name">
        <Input
          value={name}
          onChange={handleChangeName}
          id="template-name"
          placeholder="Template Name*"
          autoFocus={true}
        />
      </div>
      <div className="message-template__form-content message-template__form-content--external">
        <div className="message-template__form-message">
          <div className="message-template__form-message-subject">
            <Input
              value={subject}
              onChange={handleChangeSubject}
              id="subject"
              placeholder="Subject"
              label="Subject:"
            />
          </div>
          <div className="message-template__form-message-body">
            <textarea value={body} onChange={handleChange} />
          </div>
          <div className="message-template__form-message-btns">
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageExternalTemplateForm;
