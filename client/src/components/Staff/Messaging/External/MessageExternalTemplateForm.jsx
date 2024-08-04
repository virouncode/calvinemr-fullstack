import { useState } from "react";
import { toast } from "react-toastify";

import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagesExternalTemplatePost } from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";

const MessageExternalTemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  const messageTemplatePost = useMessagesExternalTemplatePost();

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleChangeName = (e) => {
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
    const messageTemplateToPost = {
      name: name,
      author_id: user.id,
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
        <label htmlFor="template-name">Template Name*</label>
        <input
          type="text"
          value={name}
          onChange={handleChangeName}
          id="template-name"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div className="new-message new-message--template">
        <div className="new-message__form new-message__form--template-external">
          <div className="new-message__subject">
            <strong>Subject: </strong>
            <input
              type="text"
              placeholder="Subject"
              onChange={handleChangeSubject}
              value={subject}
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

export default MessageExternalTemplateForm;
