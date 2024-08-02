import { useState } from "react";
import { useCalvinAITemplatePut } from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../utils/strings/firstLetterUpper";

const CalvinAITemplateEdit = ({ setEditTemplateVisible, templateToEdit }) => {
  const [editedTemplate, setEditedTemplate] = useState(templateToEdit);
  const [errMsg, setErrMsg] = useState("");
  const templatePut = useCalvinAITemplatePut();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({ ...editedTemplate, [name]: value });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editedTemplate.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    //save template
    const templateToPut = {
      ...editedTemplate,
      name: firstLetterOfFirstWordUpper(editedTemplate.name),
    };
    templateToPut.date_created = nowTZTimestamp();
    templatePut.mutate(templateToPut);
    setEditTemplateVisible(false);
  };
  return (
    <div className="edit-template">
      {errMsg && <p className="edit-template-err">{errMsg}</p>}
      <div className="edit-template-name">
        <label htmlFor="template-ai-name">Template name: </label>
        <input
          type="text"
          name="name"
          value={editedTemplate.name}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          id="template-ai-name"
        />
      </div>
      <div className="edit-template-body">
        <textarea
          name="prompt"
          value={editedTemplate.prompt}
          onChange={handleChange}
        />
      </div>
      <div className="edit-template-btns">
        <button onClick={handleSave} className="save-btn">
          Save
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CalvinAITemplateEdit;
