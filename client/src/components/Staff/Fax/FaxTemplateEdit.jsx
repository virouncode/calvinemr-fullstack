import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxTemplatePut } from "../../../hooks/reactquery/mutations/faxesTemplatesMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";

const FaxTemplateEdit = ({ setEditTemplateVisible, template }) => {
  const { user } = useUserContext();
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [progress, setProgress] = useState(false);
  const faxTemplatePut = useFaxTemplatePut();

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
    setEditTemplateVisible(false);
  };

  const handleSave = async (e) => {
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

    const faxTemplateToPut = {
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
      <div className="new-fax">
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

export default FaxTemplateEdit;
