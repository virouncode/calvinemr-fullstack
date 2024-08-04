import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useClinicalNotesTemplatesPost } from "../../../../../hooks/reactquery/mutations/clinicalNotesTemplatesMutations";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";

const ClinicalNotesTemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const [newTemplate, setNewTemplate] = useState({ name: "", body: "" });
  const [errMsg, setErrMsg] = useState("");
  const templatePost = useClinicalNotesTemplatesPost();

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
        <label htmlFor="clinical-template-name">Template name: </label>
        <input
          type="text"
          name="name"
          value={newTemplate.name}
          onChange={handleChange}
          placeholder="New template name"
          autoComplete="off"
          id="clinical-template-name"
        />
      </div>
      <div className="new-template-body">
        <textarea
          name="body"
          value={newTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="new-template-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default ClinicalNotesTemplateForm;
