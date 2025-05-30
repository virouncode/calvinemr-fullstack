import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
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
  const [inputText, setInputText] = useState(templateToEdit.body);
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
  const templatePut = useClinicalNotesTemplatesPut();

  useEffect(() => {
    setEditedTemplate(templateToEdit);
  }, [templateToEdit]);

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
      date_created: nowTZTimestamp(),
      body: inputText,
    };
    templatePut.mutate(templateToPut, {
      onSuccess: () => setEditTemplateVisible(false),
    });
  };
  return (
    <div className="clinical-note-template__form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="clinical-note-template__form-name">
        <Input
          value={editedTemplate.name}
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

export default ClinicalNotesTemplateEdit;
