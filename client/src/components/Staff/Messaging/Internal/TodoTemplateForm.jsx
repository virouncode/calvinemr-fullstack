import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useTodosTemplatePost } from "../../../../hooks/reactquery/mutations/messagesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../utils/strings/firstLetterUpper";

const TodoTemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  const todoTemplatePost = useTodosTemplatePost();

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
    setNewTemplateVisible(false);
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
    const todoTemplateToPost = {
      name: firstLetterOfFirstWordUpper(name),
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    todoTemplatePost.mutate(todoTemplateToPost, {
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

export default TodoTemplateForm;
