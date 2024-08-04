import { useState } from "react";
import { toast } from "react-toastify";

import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagesExternalTemplatePut } from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";

const MessageExternalTemplateEdit = ({ setEditTemplateVisible, template }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [progress, setProgress] = useState(false);
  const messageExternalTemplatePut = useMessagesExternalTemplatePut();

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleCancel = (e) => {
    setEditTemplateVisible(false);
  };

  const handleSave = async (e) => {
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
      <div className="new-message">
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

export default MessageExternalTemplateEdit;
