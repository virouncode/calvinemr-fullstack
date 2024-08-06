import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPost } from "../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT } from "../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { getExtension } from "../../../utils/files/getExtension";
import { reportSchema } from "../../../validation/record/reportValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import ReportViewer from "../../UI/Documents/ReportViewer";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import GenericList from "../../UI/Lists/GenericList";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import ReportsInboxPatients from "./ReportsInboxPatients";

const ReportsInboxForm = ({
  setAddVisible,
  initialAttachment,
  errMsgPost,
  setErrMsgPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    Media: "Download",
    Format: "Binary",
    FileExtensionAndVersion: getExtension(initialAttachment.file.path),
    File: initialAttachment.file,
  });
  const [progress, setProgress] = useState(false);
  const reportPost = useReportInboxPost();

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;

    if (name === "EventDateTime" || name === "ReceivedDateTime") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: {},
        File: null,
        FileExtensionAndVersion: "",
        [name]: value,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const isPatientChecked = (id) => {
    return formDatas.patient_id === parseInt(id);
  };

  const handleCheckPatient = (e, patient) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      patient_id: patient.patient_id,
      assigned_staff_id: patient.assigned_staff_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    const reportToPost = {
      ...formDatas,
      SourceAuthorPhysician: { AuthorFreeText: formDatas.AuthorFreeText },
      acknowledged: false,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    setProgress(true);
    reportPost.mutate(reportToPost, {
      onSuccess: () => {
        toast.success(
          "Report posted successfully to patient's assigned practitioner",
          { containerId: "A" }
        );
        setAddVisible(false);
        setProgress(false);
      },
      onError: (error) => {
        toast.error(`Error unable to post report: ${error.message}`, {
          containerId: "A",
        });
        setProgress(false);
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setAddVisible(false);
  };

  return (
    <div
      className="reportsinbox__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reportsinbox__form-content" onSubmit={handleSubmit}>
        <div className="reportsinbox__form-row reportsinbox__form-row--btns">
          <SubmitButton value="Save" disabled={progress} />
          <CancelButton onClick={handleCancel} />
        </div>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reportsinbox__form-row">
          <Input
            label="Report Name"
            name="name"
            value={formDatas.name || ""}
            onChange={handleChange}
            id="inbox-name"
          />
        </div>
        <div className="reportsinbox__form-row reportsinbox__form-row--patients">
          <label>Related patient</label>
          <ReportsInboxPatients
            isPatientChecked={isPatientChecked}
            handleCheckPatient={handleCheckPatient}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion || ""}</p>
        </div>
        <div className="reportsinbox__form-row">
          <GenericList
            label="Class"
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reportsinbox__form-row">
          <Input
            label="Sub class"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            id="inbox-subclass"
          />
        </div>
        <div className="reportsinbox__form-row">
          <InputDate
            label="Date of document"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            id="inbox-date"
          />
        </div>
        <div className="reportsinbox__form-row">
          <InputDate
            label="Date received"
            name="ReceivedDateTime"
            value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            id="inbox-date-received"
          />
        </div>
        <div className="reportsinbox__form-row">
          <Input
            label="Author"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText || ""}
            onChange={handleChange}
            id="inbox-author"
          />
        </div>
        <div className="reportsinbox__form-row reportsinbox__form-row--text">
          <label htmlFor="inbox-notes">Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes || ""}
            onChange={handleChange}
            autoComplete="off"
            id="inbox-notes"
          />
        </div>
      </form>
      <div className="reportsinbox__form-preview">
        <ReportViewer file={formDatas.File} />
      </div>
    </div>
  );
};

export default ReportsInboxForm;
