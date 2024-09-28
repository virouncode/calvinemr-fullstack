import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useClinicalNotesTemplatesPost } from "../../../../../hooks/reactquery/mutations/clinicalNotesTemplatesMutations";
import { ClinicalNoteTemplateFormType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type ClinicalNotesTemplateFormProps = {
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClinicalNotesTemplateForm = ({
  setNewTemplateVisible,
}: ClinicalNotesTemplateFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [newTemplate, setNewTemplate] = useState<ClinicalNoteTemplateFormType>({
    name: "",
    author_id: user.id,
    body: "",
    date_created: nowTZTimestamp(),
  });
  const [errMsg, setErrMsg] = useState("");
  //Queries
  const templatePost = useClinicalNotesTemplatesPost();

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
    const templateToPost: ClinicalNoteTemplateFormType = {
      ...newTemplate,
      name: firstLetterOfFirstWordUpper(newTemplate.name),
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(templateToPost, {
      onSuccess: () => setNewTemplateVisible(false),
    });
  };
  return (
    <div className="clinical-note-template__form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="clinical-note-template__form-name">
        <Input
          value={newTemplate.name}
          onChange={handleChange}
          name="name"
          id="clinical-template-name"
          placeholder="Template name*"
          autoFocus={true}
        />
      </div>
      <div className="clinical-note-template__form-body">
        <textarea
          name="body"
          value={newTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="clinical-note-template__form-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default ClinicalNotesTemplateForm;
