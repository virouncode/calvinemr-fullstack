import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useFaxTemplatePost } from "../../../../hooks/reactquery/mutations/faxesTemplatesMutations";
import { FaxTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";

type FaxTemplateFormProps = {
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FaxTemplateForm = ({ setNewTemplateVisible }: FaxTemplateFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  //Queries
  const faxTemplatePost = useFaxTemplatePost();

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
    setNewTemplateVisible(false);
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Template name field is required", { containerId: "A" });
      return;
    }
    if (!body) {
      toast.error("Your template body is empty", { containerId: "A" });
      return;
    }
    setProgress(true);
    //create the message template
    const faxTemplateToPost: Partial<FaxTemplateType> = {
      name: name,
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    faxTemplatePost.mutate(faxTemplateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
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
      <div className="new-fax new-fax--template">
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

export default FaxTemplateForm;
