import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useCalvinAITemplatePost } from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../utils/strings/firstLetterUpper";

const CalvinAITemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const [newTemplate, setNewTemplate] = useState({ name: "", prompt: "" });
  const [errMsg, setErrMsg] = useState("");
  const templatePost = useCalvinAITemplatePost();

  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleCancel = () => {
    setErrMsg("");
    setNewTemplateVisible(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newTemplate.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    const templateToPost = {
      ...newTemplate,
      name: firstLetterOfFirstWordUpper(newTemplate.name),
    };
    templateToPost.date_created = nowTZTimestamp();
    templateToPost.author_id = user.id;
    templatePost.mutate(templateToPost);
    setNewTemplateVisible(false);
  };
  return (
    <div className="new-template">
      {errMsg && <p className="new-template-err">{errMsg}</p>}
      <div className="new-template-name">
        <label htmlFor="template-ai-name">Template name: </label>
        <input
          type="text"
          name="name"
          value={newTemplate.name}
          onChange={handleChange}
          placeholder="New template name"
          autoComplete="off"
          id="template-ai-name"
        />
      </div>
      <div className="new-template-body">
        <textarea
          name="prompt"
          value={newTemplate.prompt}
          onChange={handleChange}
        />
      </div>
      <div className="new-template-btns">
        <button onClick={handleSave} className="save-btn">
          Save
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CalvinAITemplateForm;
