import React, { useState } from "react";
import ReactQuill from "react-quill-new";
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
  const [inputText, setInputText] = useState("");
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
    ],
  };

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
      body: inputText,
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
        <div className="clinical-note-template__form-body-quill">
          <ReactQuill
            theme="snow"
            value={inputText}
            onChange={setInputText}
            modules={modules}
            style={{ height: "100%" }}
          />
        </div>
      </div>
      <div className="clinical-note-template__form-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default ClinicalNotesTemplateForm;
