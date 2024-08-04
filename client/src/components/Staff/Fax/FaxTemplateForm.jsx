import { useState } from "react";
import { toast } from "react-toastify";

import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxTemplatePost } from "../../../hooks/reactquery/mutations/faxesTemplatesMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";

const FaxTemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [progress, setProgress] = useState(false);
  const faxTemplatePost = useFaxTemplatePost();

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleCancel = (e) => {
    setNewTemplateVisible(false);
  };

  const handleSave = async (e) => {
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
    const faxTemplateToPost = {
      name: name,
      author_id: user.id,
      subject: subject,
      body: body,
      date_created: nowTZTimestamp(),
    };
    faxTemplatePost.mutate(faxTemplateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <>
      <div className="new-fax__template-name">
        <label htmlFor="template-name">Template Name*</label>
        <input
          type="text"
          value={name}
          onChange={handleChangeName}
          id="template-name"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div className="new-fax new-fax--template">
        <div className="new-fax__form new-fax__form--template">
          <div className="fax__subject">
            <strong>Subject: </strong>
            <input
              type="text"
              placeholder="Subject"
              onChange={handleChangeSubject}
              value={subject}
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
