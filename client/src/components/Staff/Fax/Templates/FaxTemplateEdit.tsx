import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useFaxTemplatePut } from "../../../../hooks/reactquery/mutations/faxesTemplatesMutations";
import { FaxTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";

type FaxTemplateEditProps = {
  setEditTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  template: FaxTemplateType;
};

const FaxTemplateEdit = ({
  setEditTemplateVisible,
  template,
}: FaxTemplateEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [progress, setProgress] = useState(false);
  //Queries
  const faxTemplatePut = useFaxTemplatePut();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleSave = async () => {
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

    const faxTemplateToPut: FaxTemplateType = {
      id: template.id,
      name: name,
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    faxTemplatePut.mutate(faxTemplateToPut, {
      onSuccess: () => {
        setEditTemplateVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <>
      <div className="new-fax__template-name">
        <Input
          value={name}
          onChange={handleChangeName}
          id="template-name"
          label="Template Name*"
          autoFocus={true}
        />
      </div>
      <div className="new-fax">
        <div className="new-fax__form new-fax__form--template">
          <div className="fax__subject">
            <Input
              value={subject}
              onChange={handleChangeSubject}
              id="subject"
              label="Subject:"
            />
          </div>
          <div className="new-fax__body">
            <textarea value={body} onChange={handleChange} />
          </div>
          <div className="new-fax__btns">
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FaxTemplateEdit;
