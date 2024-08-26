import React, { useState } from "react";
import { useCalvinAITemplatePut } from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { CalvinAITemplateType } from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../utils/strings/firstLetterUpper";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type CalvinAITemplateEditProps = {
  setEditTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  templateToEdit: CalvinAITemplateType | undefined;
};

const CalvinAITemplateEdit = ({
  setEditTemplateVisible,
  templateToEdit,
}: CalvinAITemplateEditProps) => {
  //Hooks
  const [editedTemplate, setEditedTemplate] = useState<
    CalvinAITemplateType | undefined
  >(templateToEdit);
  const [errMsg, setErrMsg] = useState("");
  const templatePut = useCalvinAITemplatePut();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({
      ...(editedTemplate as CalvinAITemplateType),
      [name]: value,
    });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleSave = async () => {
    if (!editedTemplate?.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    //save template
    const templateToPut: CalvinAITemplateType = {
      ...editedTemplate,
      name: firstLetterOfFirstWordUpper(editedTemplate.name),
      date_created: nowTZTimestamp(),
    };
    templatePut.mutate(templateToPut);
    setEditTemplateVisible(false);
  };
  return (
    editedTemplate && (
      <div className="edit-template">
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
        <div className="edit-template-name">
          <Input
            value={editedTemplate.name}
            onChange={handleChange}
            name="name"
            id="template-ai-name"
            label="Template name:"
            autoFocus={true}
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
          <SaveButton onClick={handleSave} />
          <CancelButton onClick={handleCancel} />
        </div>
      </div>
    )
  );
};

export default CalvinAITemplateEdit;
