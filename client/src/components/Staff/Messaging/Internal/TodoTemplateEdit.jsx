import { useState } from "react";
import { toast } from "react-toastify";

import useUserContext from "../../../../hooks/context/useUserContext";
import { useTodosTemplatePut } from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../utils/strings/firstLetterUpper";

const TodoTemplateEdit = ({ template, setEditTemplateVisible }) => {
  const { user } = useUserContext();
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [progress, setProgress] = useState(false);
  const todoTemplatePut = useTodosTemplatePut();

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
    //create the message template
    const todoTemplateToPut = {
      name: firstLetterOfFirstWordUpper(name),
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    todoTemplatePut.mutate(todoTemplateToPut, {
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
      <div className="new-message new-message--template">
        <div className="new-message__form new-message__form--todo">
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
            <textarea value={body} onChange={handleChange} autoFocus></textarea>
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

export default TodoTemplateEdit;
