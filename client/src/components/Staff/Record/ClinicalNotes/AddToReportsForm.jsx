import { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useReportPost } from "../../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT } from "../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { getExtension } from "../../../../utils/files/getExtension";
import GenericList from "../../../UI/Lists/GenericList";

const AddToReportsForm = ({ attachment, patientId, date, setAddToReports }) => {
  const { user } = useUserContext();
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    name: attachment.alias,
    Media: "Download",
    Format: "Binary",
    FileExtensionAndVersion: getExtension(attachment.file.path),
    ReceivedDateTime: date,
    SourceAuthorPhysician: { AuthorFreeText: "" },
    File: attachment.file,
    assigned_staff_id: user.id,
  });
  const reportPost = useReportPost(patientId);

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
        FileExtensionAndVersion: "",
        [name]: value,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      SourceAuthorPhysician: { AuthorFreeText: formDatas.AuthorFreeText },
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    if (datasToPost.ReportReviewed?.Name?.FirstName) {
      datasToPost.ReportReviewed = [datasToPost.ReportReviewed];
      datasToPost.acknowledged = true;
    }

    // if (datasToPost.Format === "Binary" && !datasToPost.File.type) {
    //   datasToPost.File.type = "document";
    // }

    //Submissions
    reportPost.mutate(datasToPost, {
      onSuccess: () => {
        setAddToReports(false);
      },
    });
  };

  return (
    <div className="reports__form">
      <form className="reports__content" onSubmit={handleSubmit}>
        <div className="reports__row reports__row--btns">
          <input type="submit" value="Save" />
          <button>Cancel</button>
        </div>
        {errMsgPost && <p className="reports__err">{errMsgPost}</p>}
        <div className="reports__row">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            autoComplete="off"
            name="name"
            value={formDatas.name || ""}
            onChange={handleChange}
            id="name"
          />
        </div>
        <div className="reports__row">
          <label>Format</label>
          {formDatas.Format}
        </div>
        <div className="reports__row">
          <label>File extension</label>
          {formDatas.FileExtensionAndVersion}
        </div>
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
          <label htmlFor="subclass">Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            autoComplete="off"
            id="subclass"
          />
        </div>
        <div className="reports__row">
          <label htmlFor="date-of-doc">Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
            id="date-of-doc"
          />
        </div>
        <div className="reports__row">
          <label htmlFor="date-received">Date received</label>
          <input
            type="date"
            name="ReceivedDateTime"
            value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            autoComplete="off"
            id="date-received"
          />
        </div>
        <div className="reports__row">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText || ""}
            onChange={handleChange}
            autoComplete="off"
            id="author"
          />
        </div>
        <div className="reports__row reports__row--special">
          <label>Reviewed by</label>
          <div>
            <div className="reports__subrow">
              <label htmlFor="reviewed-first-name">First name</label>
              <input
                type="text"
                name="FirstName"
                value={formDatas.ReportReviewed?.Name?.FirstName || ""}
                onChange={handleReviewedName}
                autoComplete="off"
                id="reviewed-first-name"
              />
            </div>
            <div className="reports__subrow">
              <label htmlFor="reviewed-last-name">Last name</label>
              <input
                type="text"
                name="LastName"
                value={formDatas.ReportReviewed?.Name?.LastName || ""}
                onChange={handleReviewedName}
                autoComplete="off"
                id="reviewed-last-name"
              />
            </div>
            <div className="reports__subrow">
              <label htmlFor="ohip">OHIP#</label>
              <input
                type="text"
                name="ReviewingOHIPPhysicianId"
                value={formDatas.ReportReviewed?.ReviewingOHIPPhysicianId || ""}
                onChange={handleReviewedOHIP}
                autoComplete="off"
                id="ohip"
              />
            </div>
            <div className="reports__subrow">
              <label htmlFor="date-reviewed">Date reviewed</label>
              <input
                type="date"
                name="DateTimeReportReviewed"
                value={timestampToDateISOTZ(
                  formDatas.ReportReviewed?.DateTimeReportReviewed
                )}
                onChange={handleReviewedDate}
                id="date-reviewed"
              />
            </div>
          </div>
        </div>
        <div className="reports__row reports__row--text">
          <label htmlFor="notes">Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes || ""}
            onChange={handleChange}
            autoComplete="off"
            id="notes"
          />
        </div>
      </form>
      <div className="reports__preview">
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
              title={formDatas.alias}
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

export default AddToReportsForm;
