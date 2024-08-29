import React, { useState } from "react";
import { useClinicalNotesTemplatesPut } from "../../../../../hooks/reactquery/mutations/clinicalNotesTemplatesMutations";
import { ClinicalNoteTemplateType } from "../../../../../types/api";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type ClinicalNotesTemplateEditProps = {
  setEditTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  templateToEdit: ClinicalNoteTemplateType;
};

const ClinicalNotesTemplateEdit = ({
  setEditTemplateVisible,
  templateToEdit,
}: ClinicalNotesTemplateEditProps) => {
  //Hooks
  const [editedTemplate, setEditedTemplate] =
    useState<ClinicalNoteTemplateType>(templateToEdit);
  const [errMsg, setErrMsg] = useState("");
  //Queries
  const templatePut = useClinicalNotesTemplatesPut();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({ ...editedTemplate, [name]: value });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleSave = async () => {
    if (!editedTemplate.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    //save template
    const templateToPut: ClinicalNoteTemplateType = {
      ...editedTemplate,
      name: firstLetterOfFirstWordUpper(editedTemplate.name),
    };
    templateToPut.date_created = nowTZTimestamp();
    templatePut.mutate(templateToPut, {
      onSuccess: () => setEditTemplateVisible(false),
    });
  };
  return (
    <div className="edit-template">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="edit-template-name">
        <Input
          value={editedTemplate.name}
          onChange={handleChange}
          name="name"
          id="clinical-template-name"
          label="Template name:"
          autoFocus={true}
        />
      </div>
      <div className="edit-template-body">
        <textarea
          name="body"
          value={editedTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="edit-template-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default ClinicalNotesTemplateEdit;
