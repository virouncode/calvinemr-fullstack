import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";
import { useState } from "react";
import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { reportClassCT } from "../../../../../omdDatas/codesTables";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/names/staffIdToName";
import { showReportTextContent } from "../../../../../utils/reports/showReportTextContent";
import { reportSchema } from "../../../../../validation/record/reportValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const ReportItemReceived = ({
  item,
  lastItemReceivedRef = null,
  setErrMsgPost,
  errMsgPost,
  reportPut,
  reportDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setAttachmentsToSend,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  const handleChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleDeleteClick = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      reportDelete.mutate(item.id, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleAcknowledge = async () => {
    setErrMsgPost("");
    const reportToPut = {
      ...item,
      acknowledged: true,
      ReportReviewed: [
        {
          Name: {
            FirstName: staffIdToFirstName(staffInfos, user.id),
            LastName: staffIdToLastName(staffInfos, user.id),
          },
          ReviewingOHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
          DateTimeReportReviewed: nowTZTimestamp(),
          updates: [
            ...item.updates,
            { updated_by_id: user.id, date_updated: nowTZTimestamp() },
          ],
        },
      ],
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    setProgress(true);
    reportPut.mutate(reportToPut, {
      onSuccess: () => {
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleEdit = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };

  const handleSave = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await reportSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    setProgress(true);
    const reportToPut = {
      ...itemInfos,
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Submission
    setProgress(true);
    reportPut.mutate(reportToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };

  const handleFax = async () => {
    if (item.Format === "Binary") {
      setFileToFax({ alias: item.name, file: item.File });
    } else {
      const pdfDoc = await PDFDocument.create();
      const pdfPage = pdfDoc.addPage(PageSizes.Letter);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      pdfPage.setFont(helveticaFont);
      pdfPage.drawText(`${item.name}\n\n${item.Content?.TextContent}`, {
        x: 25,
        y: pdfPage.getHeight() - 38,
        font: helveticaFont,
        size: 10,
        color: rgb(0, 0, 0),
        lineHeight: 14,
        maxWidth: pdfPage.getWidth() - 50,
      });
      const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
      let fileToUpload = await xanoPost("/upload/attachment", "staff", {
        content: pdfURI,
      });
      setFileToFax({
        alias: `${item.name.replaceAll(" ", "")}.pdf`,
        file: fileToUpload,
      });
    }
    setFaxVisible(true);
  };
  const handleSend = async () => {
    let fileToSend;
    if (item.Format === "Binary") {
      fileToSend = item.File;
    } else {
      const pdfDoc = await PDFDocument.create();
      const pdfPage = pdfDoc.addPage(PageSizes.Letter);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      pdfPage.setFont(helveticaFont);
      pdfPage.drawText(`${item.name}\n\n${item.Content?.TextContent}`, {
        x: 25,
        y: pdfPage.getHeight() - 38,
        font: helveticaFont,
        size: 10,
        color: rgb(0, 0, 0),
        lineHeight: 14,
        maxWidth: pdfPage.getWidth() - 50,
      });
      const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
      let fileToUpload = await xanoPost("/upload/attachment", "staff", {
        content: pdfURI,
      });
      fileToSend = fileToUpload;
    }
    setAttachmentsToSend([
      {
        file: fileToSend,
        alias: item.name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageExternalVisible(true);
  };

  return (
    <tr
      className="reports__item"
      ref={lastItemReceivedRef}
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <td>
        <div className="reports__item-btn-container">
          {editVisible ? (
            <>
              <button
                onClick={handleSave}
                disabled={progress}
                className="save-btn"
              >
                Save
              </button>
              <button onClick={handleCancel} disabled={progress}>
                Cancel
              </button>
            </>
          ) : (
            <>
              {!item.acknowledged && item.assigned_staff_id === user.id && (
                <button onClick={handleAcknowledge} disabled={progress}>
                  Acknowledge
                </button>
              )}
              <button onClick={handleEdit} disabled={progress}>
                Edit
              </button>
              <button onClick={handleSend} disabled={progress}>
                Send
              </button>
              <button onClick={handleFax} disabled={progress}>
                Fax
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={user.id !== item.assigned_staff_id || progress}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
      <td>
        {editVisible ? (
          <input
            type="text"
            value={itemInfos.name}
            onChange={handleChange}
            name="name"
          />
        ) : (
          item.name
        )}
      </td>
      <td>{item.Format}</td>
      <td>{item.FileExtensionAndVersion}</td>
      <td
        className="reports__link"
        onClick={() =>
          item.File
            ? showDocument(item.File?.url, item.File?.mime)
            : showReportTextContent(item)
        }
        style={{
          fontWeight: item.ReportReviewed.length ? "normal" : "bold",
          color: item.ReportReviewed.length ? "black" : "blue",
        }}
      >
        {item.File ? item.File.name : "See text content"}
      </td>
      <td>
        {editVisible ? (
          <GenericList
            name="Class"
            value={itemInfos.Class}
            handleChange={handleChange}
            list={reportClassCT}
          />
        ) : (
          item.Class
        )}
      </td>
      <td>
        {editVisible ? (
          <input
            type="text"
            name="SubClass"
            value={itemInfos.SubClass}
            onChange={handleChange}
            autoComplete="off"
          />
        ) : (
          item.SubClass
        )}
      </td>
      <td>{timestampToDateISOTZ(item.EventDateTime)}</td>
      <td>{timestampToDateISOTZ(item.ReceivedDateTime)}</td>
      <td>
        {editVisible ? (
          <input
            type="text"
            name="AuthorFreeText"
            value={itemInfos.AuthorFreeText || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        ) : item.SourceAuthorPhysician?.AuthorFreeText ? (
          item.SourceAuthorPhysician.AuthorFreeText
        ) : item.SourceAuthorPhysician?.AuthorName?.FirstName ? (
          `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
        ) : (
          ""
        )}
      </td>
      <td>
        {item.ReportReviewed.length
          ? item.ReportReviewed.map((review) =>
              review?.Name?.FirstName ? (
                <span key={review.Name.LastName}>
                  {review.Name?.FirstName || ""} {review.Name?.LastName || ""}{" "}
                  {review.ReviewingOHIPPhysicianId || ""}
                </span>
              ) : null
            )
          : ""}
      </td>
      <td>
        {item.ReportReviewed.length
          ? item.ReportReviewed.map((review) =>
              review?.DateTimeReportReviewed ? (
                <span key={review.DateTimeReportReviewed}>
                  {timestampToDateISOTZ(review.DateTimeReportReviewed)}
                </span>
              ) : null
            )
          : ""}
      </td>
      <td>
        {editVisible ? (
          <input
            type="text"
            name="Notes"
            value={itemInfos.Notes || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        ) : (
          item.Notes
        )}
      </td>
      <SignCell item={item} />
    </tr>
  );
};

export default ReportItemReceived;
