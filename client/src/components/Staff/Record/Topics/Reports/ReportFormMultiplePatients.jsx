import { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  reportClassCT,
  reportFormatCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { getExtension } from "../../../../../utils/files/getExtension";
import { patientIdToAssignedStaffTitleAndName } from "../../../../../utils/names/patientIdToName";
import { reportMultipleSchema } from "../../../../../validation/record/reportValidation";
import GenericList from "../../../../UI/Lists/GenericList";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";

const ReportFormMultiplePatients = ({
  demographicsInfos,
  patientsIds,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  attachment = null,
  reportPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    Format: "Binary",
    File: attachment ? attachment.file : null,
    FileExtensionAndVersion: attachment
      ? getExtension(attachment.file.path)
      : "",
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [sentOrReceived, setSentOrReceived] = useState("Received");
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;

    if (
      name === "EventDateTime" ||
      name === "ReceivedDateTime" ||
      name === "DateTimeSent"
    ) {
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
  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
  };
  const handleReviewedName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        Name: { ...formDatas.ReportReviewed?.Name, [name]: value },
      },
    });
  };
  const handleReviewedOHIP = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        ReviewingOHIPPhysicianId: value,
      },
    });
  };
  const handleReviewedDate = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        DateTimeReportReviewed: dateISOToTimestampTZ(value),
      },
    });
  };
  const handleRecipientName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      RecipientName: { ...formDatas.RecipientName, [name]: value },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSentOrReceived = (e) => {
    const value = e.target.value;
    setErrMsgPost("");
    setSentOrReceived(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    //Validation
    try {
      await reportMultipleSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    try {
      for (let patientId of patientsIds) {
        const reportToPost = {
          ...formDatas,
          patient_id: patientId,
          assigned_staff_id: demographicsInfos.find(
            ({ patient_id }) => patient_id === patientId
          )?.assigned_staff_id,
          SourceAuthorPhysician: {
            AuthorFreeText:
              sentOrReceived === "Sent"
                ? patientIdToAssignedStaffTitleAndName(
                    demographicsInfos.find(
                      ({ patient_id }) => patient_id === patientId
                    ),
                    staffInfos,
                    patientId
                  )
                : "",
          },
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
        };
        //Formatting
        if (reportToPost.ReportReviewed?.Name?.FirstName) {
          reportToPost.ReportReviewed = [reportToPost.ReportReviewed];
          reportToPost.acknowledged = true;
        }
        if (sentOrReceived === "Sent") {
          reportToPost.acknowledged = true;
        }
        //Submission
        reportPost.mutate(reportToPost);
      }
      setProgress(false);
      setAddVisible(false);
    } catch (err) {
      setErrMsgPost(err.message);
      setProgress(false);
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsgPost("");
    setIsLoadingFile(true);
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
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
        const fileToUpload = await xanoPost("/upload/attachment", "staff", {
          content,
        });
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
      className="reports__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reports__content" onSubmit={handleSubmit}>
        {errMsgPost && <div className="reports__err">{errMsgPost}</div>}
        <div className="reports__form-btn-container">
          <input
            type="submit"
            value={isLoadingFile ? "Loading" : "Save"}
            disabled={isLoadingFile || progress}
          />
          <button
            type="button"
            onClick={handleCancel}
            disabled={progress || isLoadingFile}
          >
            Cancel
          </button>
        </div>
        <div className="reports__row">
          <label htmlFor="report-sent-received">Sent or Received</label>
          <select
            value={sentOrReceived}
            onChange={handleSentOrReceived}
            id="report-sent-received"
          >
            <option value="Received">Received</option>
            <option value="Sent">Sent</option>
          </select>
        </div>
        <div className="reports__row">
          <label htmlFor="report-name">Report Name</label>
          <input
            type="text"
            autoComplete="off"
            name="name"
            value={formDatas.name || ""}
            onChange={handleChange}
            id="report-name"
          />
        </div>
        <div className="reports__row">
          <label>Format</label>
          <GenericList
            name="Format"
            value={formDatas.Format || ""}
            handleChange={handleChange}
            list={reportFormatCT}
          />
        </div>
        <div className="reports__row">
          <label>File extension</label>
          <span>{formDatas.FileExtensionAndVersion || ""}</span>
        </div>
        {formDatas.Format === "Binary" ? (
          !attachment && (
            <div className="reports__row">
              <label>Content</label>
              <input
                name="Content"
                type="file"
                onChange={handleUpload}
                accept=".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
              />
            </div>
          )
        ) : (
          <div className="reports__row reports__row--text">
            <label htmlFor="report-content">Content</label>
            <textarea
              name="Content"
              value={formDatas.Content?.TextContent || ""}
              onChange={handleContentChange}
              id="report-content"
            />
          </div>
        )}
        <div className="reports__row">
          <label>Class</label>
          <GenericList
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reports__row">
          <label htmlFor="report-subclass">Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            autoComplete="off"
            id="report-subclass"
          />
        </div>
        <div className="reports__row">
          <label htmlFor="report-date">Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
            id="report-date"
          />
        </div>
        {sentOrReceived === "Received" && (
          <div className="reports__row">
            <label htmlFor="report-date-received">Date received</label>
            <input
              type="date"
              name="ReceivedDateTime"
              value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
              onChange={handleChange}
              autoComplete="off"
              id="report-date-received"
            />
          </div>
        )}
        {sentOrReceived === "Sent" && (
          <div className="reports__row">
            <label htmlFor="report-date-sent">Date sent</label>
            <input
              type="date"
              name="DateTimeSent"
              value={timestampToDateISOTZ(formDatas.DateTimeSent)}
              onChange={handleChange}
              autoComplete="off"
              id="report-date-sent"
            />
          </div>
        )}
        <div className="reports__row">
          <label htmlFor="report-author">Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText || ""}
            onChange={handleChange}
            autoComplete="off"
            id="report-author"
          />
        </div>
        {sentOrReceived === "Received" && (
          <div className="reports__row reports__row--special">
            <label>Reviewed by</label>
            <div>
              <div className="reports__subrow">
                <label htmlFor="report-reviewed-first-name">First name</label>
                <input
                  type="text"
                  name="FirstName"
                  value={formDatas.ReportReviewed?.Name?.FirstName || ""}
                  onChange={handleReviewedName}
                  autoComplete="off"
                  id="report-reviewed-first-name"
                />
              </div>
              <div className="reports__subrow">
                <label htmlFor="report-reviewed-last-name">Last name</label>
                <input
                  type="text"
                  name="LastName"
                  value={formDatas.ReportReviewed?.Name?.LastName || ""}
                  onChange={handleReviewedName}
                  autoComplete="off"
                  id="report-reviewed-last-name"
                />
              </div>
              <div className="reports__subrow">
                <label htmlFor="report-reviewed-ohip">OHIP#</label>
                <input
                  type="text"
                  name="ReviewingOHIPPhysicianId"
                  value={
                    formDatas.ReportReviewed?.ReviewingOHIPPhysicianId || ""
                  }
                  onChange={handleReviewedOHIP}
                  autoComplete="off"
                  id="report-reviewed-ohip"
                />
              </div>
              <div className="reports__subrow">
                <label htmlFor="report-reviewed-date">Date reviewed</label>
                <input
                  type="date"
                  name="DateTimeReportReviewed"
                  value={timestampToDateISOTZ(
                    formDatas.ReportReviewed?.DateTimeReportReviewed
                  )}
                  onChange={handleReviewedDate}
                  autoComplete="off"
                  id="report-reviewed-date"
                />
              </div>
            </div>
          </div>
        )}
        <div className="reports__row reports__row--text">
          <label htmlFor="report-notes">Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes || ""}
            onChange={handleChange}
            autoComplete="off"
            id="report-notes"
          />
        </div>
        {sentOrReceived === "Sent" && (
          <div className="reports__row reports__row--special">
            <label>Recipient</label>
            <div>
              <div className="reports__subrow">
                <label htmlFor="report-recipient-first-name">First name</label>
                <input
                  type="text"
                  name="FirstName"
                  value={formDatas.RecipientName?.FirstName || ""}
                  onChange={handleRecipientName}
                  autoComplete="off"
                  id="report-recipient-first-name"
                />
              </div>
              <div className="reports__subrow">
                <label htmlFor="report-recipient-last-name">Last name</label>
                <input
                  type="text"
                  name="LastName"
                  value={formDatas.RecipientName?.LastName || ""}
                  onChange={handleRecipientName}
                  autoComplete="off"
                  id="report-recipient-last-name"
                />
              </div>
            </div>
          </div>
        )}
      </form>
      <div className="reports__preview">
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
              height="700px"
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
              height="700px"
            />
          )
        )}
      </div>
    </div>
  );
};

export default ReportFormMultiplePatients;
