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

  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
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
          <input type="submit" value="Save" disabled={progress} />
          <button onClick={handleCancel}>Cancel</button>
        </div>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reportsinbox__form-row">
          <label htmlFor="inbox-name">Report Name</label>
          <input
            name="name"
            type="text"
            value={formDatas.name || ""}
            onChange={handleChange}
            autoComplete="off"
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
          <label>Class</label>
          <GenericList
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label htmlFor="inbox-subclass">Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            autoComplete="off"
            id="inbox-subclass"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label htmlFor="inbox-date">Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
            id="inbox-date"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label htmlFor="inbox-date-received">Date received</label>
          <input
            type="date"
            name="ReceivedDateTime"
            value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            autoComplete="off"
            id="inbox-date-received"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label htmlFor="inbox-author">Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText || ""}
            onChange={handleChange}
            autoComplete="off"
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
        {formDatas.File && formDatas.File.mime?.includes("image") ? (
          <img
            src={`${import.meta.env.VITE_XANO_BASE_URL}${formDatas.File.path}`}
            alt=""
            width="100%"
          />
        ) : formDatas.File && formDatas.File.mime?.includes("video") ? (
          <video controls>
            <source
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                formDatas.File.path
              }`}
              type={formDatas.File.mime}
            />
          </video>
        ) : formDatas.File &&
          formDatas.File.mime?.includes("officedocument") ? (
          <div>
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${
                import.meta.env.VITE_XANO_BASE_URL
              }${formDatas.File.path}&embedded=true&widget=false`}
              width="100%"
              height="900px"
              frameBorder="0"
            />
          </div>
        ) : (
          formDatas.File && (
            <iframe
              title={formDatas.name}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                formDatas.File.path
              }`}
              type={formDatas.File.type}
              width="100%"
              style={{ border: "none" }}
              height="900px"
            />
          )
        )}
      </div>
    </div>
  );
};

export default ReportsInboxForm;
