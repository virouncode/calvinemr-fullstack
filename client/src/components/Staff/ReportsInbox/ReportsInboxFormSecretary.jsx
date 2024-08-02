import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPost } from "../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT, reportFormatCT } from "../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { getExtension } from "../../../utils/files/getExtension";
import { reportSchema } from "../../../validation/record/reportValidation";
import GenericList from "../../UI/Lists/GenericList";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import ReportsInboxPatients from "./ReportsInboxPatients";

const ReportsInboxFormSecretary = ({ errMsg, setErrMsg }) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    Format: "Binary",
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(false);
  const reportPost = useReportInboxPost();

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
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
    setErrMsg("");
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
    setErrMsg("");
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
      setErrMsg(err.message);
      return;
    }
    if (
      staffInfos.find(({ id }) => id === formDatas.assigned_staff_id)
        .account_status === "Closed"
    ) {
      setErrMsg(
        "This patient's assigned practitioner is no longer working at the clinic, please assign a new practitioner to the patient in the patient's record"
      );
      return;
    }

    setProgress(true);
    reportPost.mutate(reportToPost, {
      onSuccess: () => {
        toast.success(
          "Report posted successfully to patient's assigned practitioner",
          { containerId: "A" }
        );
        setProgress(false);
      },
      onError: (error) => {
        toast.error(`Error unable to post report: ${error.message}`, {
          containerId: "A",
        });
        setProgress(false);
      },
    });
    if (formDatas.Format === "Binary") {
      fileInputRef.current.value = null;
    }
    setFormDatas({
      name: "",
      Format: "Binary",
      FileExtensionAndVersion: "",
      Content: {},
      Class: "",
      SubClass: "",
      EventDateTime: null,
      ReceivedDateTime: null,
      SourceAuthorPhysician: {
        AuthorFreeText: "",
      },
      Notes: "",
    });
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      setErrMsg("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        const fileToUpload = await xanoPost(
          "/upload/attachment",
          "staff",

          { content }
        );
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          File: fileToUpload,
          FileExtensionAndVersion: getExtension(fileToUpload.path),
          Content: {},
        });
      } catch (err) {
        setIsLoadingFile(false);
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };

  return (
    <div
      className="reportsinbox__form"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      <form className="reportsinbox__form-content" onSubmit={handleSubmit}>
        <div className="reportsinbox__form-row reportsinbox__form-row--btns">
          <input
            type="submit"
            value="Post"
            disabled={isLoadingFile || progress}
          />
        </div>
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
          <label>Format</label>
          <GenericList
            name="Format"
            value={formDatas.Format || ""}
            handleChange={handleChange}
            list={reportFormatCT}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion || ""}</p>
        </div>
        {formDatas.Format === "Binary" ? (
          <div className="reportsinbox__form-row">
            <label>Content</label>
            <input
              name="Content"
              required
              type="file"
              onChange={handleUpload}
              accept=".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
              // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="reportsinbox__form-row reportsinbox__form-row--text">
            <label htmlFor="inbox-content">Content</label>
            <textarea
              name="Content"
              value={formDatas.Content?.TextContent || ""}
              onChange={handleContentChange}
              id="inbox-content"
            />
          </div>
        )}
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
        {isLoadingFile && <LoadingParagraph />}
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

export default ReportsInboxFormSecretary;
