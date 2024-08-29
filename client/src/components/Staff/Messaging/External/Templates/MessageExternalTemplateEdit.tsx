import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useMessagesExternalTemplatePut } from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageExternalTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";

type MessageExternalTemplateEditProps = {
  setEditTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  template: MessageExternalTemplateType;
};

const MessageExternalTemplateEdit = ({
  setEditTemplateVisible,
  template,
}: MessageExternalTemplateEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [progress, setProgress] = useState(false);
  //Queries
  const messageExternalTemplatePut = useMessagesExternalTemplatePut();

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
    setEditTemplateVisible(false);
  };

  const handleSave = async () => {
    //Validation
    if (!name) {
      toast.error("Template name field is required", { containerId: "A" });
      return;
    }
    if (!body) {
      toast.error("Your template body is empty", { containerId: "A" });
      return;
    }

    setProgress(true);
    //create the message to put
    const messageTemplateToPut = {
      id: template.id,
      name: name,
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    messageExternalTemplatePut.mutate(messageTemplateToPut, {
      onSuccess: () => {
        setEditTemplateVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <>
      <div className="new-message__template-name">
        <Input
          value={name}
          onChange={handleChangeName}
          id="template-name"
          label="Template Name*"
          autoFocus={true}
        />
      </div>
      <div className="new-message">
        <div className="new-message__form new-message__form--template-external">
          <div className="new-message__subject">
            <Input
              value={subject}
              onChange={handleChangeSubject}
              id="subject"
              placeholder="Subject"
              label="Subject:"
            />
          </div>
          <div className="new-message__body">
            <textarea value={body} onChange={handleChange} />
          </div>
          <div className="new-message__btns">
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageExternalTemplateEdit;
