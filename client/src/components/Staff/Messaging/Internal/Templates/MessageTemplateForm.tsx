import React, { useState } from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useMessagesTemplatePost } from "../../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { MessageTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import StaffContacts from "../../StaffContacts";

type MessageTemplateFormProps = {
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageTemplateForm = ({
  setNewTemplateVisible,
}: MessageTemplateFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [name, setName] = useState("");
  const [recipientsIds, setRecipientsIds] = useState<number[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  const messageTemplatePost = useMessagesTemplatePost();

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

    //create the message template
    const messageTemplateToPost: Partial<MessageTemplateType> = {
      name: firstLetterOfFirstWordUpper(name),
      author_id: user.id,
      to_staff_ids: recipientsIds,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    messageTemplatePost.mutate(messageTemplateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
        setProgress(false);
      },
      onError: () => {
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
      <div className="new-message new-message--template">
        <div className="new-message__contacts new-message__contacts--template">
          <StaffContacts
            recipientsIds={recipientsIds}
            setRecipientsIds={setRecipientsIds}
          />
        </div>
        <div className="new-message__form new-message__form--template">
          <div className="new-message__recipients">
            <Input
              label="To:"
              id="to"
              placeholder="Recipients"
              value={staffInfos
                .filter(({ id }) => recipientsIds.includes(id))
                .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
                .join(" / ")}
              readOnly
            />
          </div>
          <div className="new-message__subject">
            <Input
              value={subject}
              onChange={handleChangeSubject}
              id="subject"
              label="Subject:"
              placeholder="Subject"
            />
          </div>
          <div className="new-message__body">
            <textarea value={body} onChange={handleChange}></textarea>
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

export default MessageTemplateForm;
