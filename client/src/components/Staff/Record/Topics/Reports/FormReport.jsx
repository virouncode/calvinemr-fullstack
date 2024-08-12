import {
  reportClassCT,
  reportFormatCT,
} from "../../../../../omdDatas/codesTables";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import ReportViewer from "../../../../UI/Documents/ReportViewer";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";

const FormReport = ({
  errMsgPost,
  formDatas,
  isLoadingFile,
  progress,
  sentOrReceived,
  attachment,
  handleSubmit,
  handleCancel,
  handleUpload,
  handleSentOrReceived,
  handleChange,
  handleContentChange,
  handleReviewedName,
  handleReviewedDate,
  handleReviewedOHIP,
  handleRecipientName,
}) => {
  return (
    <div
      className="reports__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reports__content" onSubmit={handleSubmit}>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reports__form-btn-container">
          <SubmitButton
            label={isLoadingFile ? "Loading" : "Save"}
            disabled={isLoadingFile || progress}
          />
          <CancelButton
            onClick={handleCancel}
            disabled={progress || isLoadingFile}
          />
        </div>
        <div className="reports__row">
          <label htmlFor="report-sent-received">Sent or Received*</label>
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
          <Input
            label="Report Name*"
            name="name"
            value={formDatas.name || ""}
            onChange={handleChange}
            id="report-name"
            autoFocus={true}
          />
        </div>
        <div className="reports__row">
          <GenericList
            label="Format*"
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
                accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
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
          <GenericList
            label="Class*"
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reports__row">
          <Input
            label="Sub class"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            id="report-subclass"
          />
        </div>
        <div className="reports__row">
          <InputDate
            label="Date of document"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            id="report-date"
          />
        </div>
        {sentOrReceived === "Received" && (
          <div className="reports__row">
            <InputDate
              label="Date received"
              name="ReceivedDateTime"
              value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
              onChange={handleChange}
              id="report-date-received"
            />
          </div>
        )}
        {sentOrReceived === "Sent" && (
          <div className="reports__row">
            <InputDate
              label="Date sent"
              name="DateTimeSent"
              value={timestampToDateISOTZ(formDatas.DateTimeSent)}
              onChange={handleChange}
              id="report-date-sent"
            />
          </div>
        )}
        <div className="reports__row">
          <Input
            label="Author"
            name="AuthorFreeText"
            value={formDatas.SourceAuthorPhysician.AuthorFreeText || ""}
            onChange={handleChange}
            id="report-author"
          />
        </div>
        {sentOrReceived === "Received" && (
          <div className="reports__row reports__row--special">
            <label>Reviewed by</label>
            <div>
              <div className="reports__subrow">
                <Input
                  label="First name"
                  name="FirstName"
                  value={formDatas.ReportReviewed?.[0].Name?.FirstName || ""}
                  onChange={handleReviewedName}
                  id="report-reviewed-first-name"
                />
              </div>
              <div className="reports__subrow">
                <Input
                  label="Last name"
                  name="LastName"
                  value={formDatas.ReportReviewed?.[0].Name?.LastName || ""}
                  onChange={handleReviewedName}
                  id="report-reviewed-last-name"
                />
              </div>
              <div className="reports__subrow">
                <Input
                  label="OHIP#"
                  name="ReviewingOHIPPhysicianId"
                  value={
                    formDatas.ReportReviewed?.[0].ReviewingOHIPPhysicianId || ""
                  }
                  onChange={handleReviewedOHIP}
                  id="report-reviewed-ohip"
                />
              </div>
              <div className="reports__subrow">
                <InputDate
                  label="Date reviewed"
                  name="DateTimeReportReviewed"
                  value={timestampToDateISOTZ(
                    formDatas.ReportReviewed?.[0].DateTimeReportReviewed
                  )}
                  onChange={handleReviewedDate}
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
            id="report-notes"
          />
        </div>
        {sentOrReceived === "Sent" && (
          <div className="reports__row reports__row--special">
            <label>Recipient</label>
            <div>
              <div className="reports__subrow">
                <Input
                  label="First name"
                  name="FirstName"
                  value={formDatas.RecipientName?.FirstName || ""}
                  onChange={handleRecipientName}
                  id="report-recipient-first-name"
                />
              </div>
              <div className="reports__subrow">
                <Input
                  label="Last name"
                  name="LastName"
                  value={formDatas.RecipientName?.LastName || ""}
                  onChange={handleRecipientName}
                  id="report-recipient-last-name"
                />
              </div>
            </div>
          </div>
        )}
      </form>
      <div className="reports__preview">
        {isLoadingFile && <LoadingParagraph />}
        <ReportViewer file={formDatas.File} />
      </div>
    </div>
  );
};

export default FormReport;
