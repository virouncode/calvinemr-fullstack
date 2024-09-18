import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useCalvinAITemplatePost } from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { CalvinAITemplateType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../utils/strings/firstLetterUpper";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type CalvinAITemplateFormProps = {
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalvinAITemplateForm = ({
  setNewTemplateVisible,
}: CalvinAITemplateFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [newTemplate, setNewTemplate] = useState<Partial<CalvinAITemplateType>>(
    { name: "", prompt: "" }
  );
  const [errMsg, setErrMsg] = useState("");
  //Queries
  const templatePost = useCalvinAITemplatePost();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleCancel = () => {
    setErrMsg("");
    setNewTemplateVisible(false);
  };

  const handleSave = async () => {
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
    templatePost.mutate(templateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
      },
    });
  };
  return (
    <div className="calvinai-template__form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="calvinai-template__form-name">
        <Input
          value={newTemplate.name ?? ""}
          onChange={handleChange}
          name="name"
          id="template-ai-name"
          label="Template name:"
          placeholder="New template name"
          autoFocus={true}
        />
      </div>
      <div className="calvinai-template__form-content">
        <textarea
          name="prompt"
          value={newTemplate.prompt}
          onChange={handleChange}
        />
      </div>
      <div className="calvinai-template__form-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default CalvinAITemplateForm;
