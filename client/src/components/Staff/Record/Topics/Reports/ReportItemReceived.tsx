import { UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";
import React, { useEffect, useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { reportClassCT } from "../../../../../omdDatas/codesTables";
import {
  AttachmentType,
  MessageAttachmentType,
  ReportType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

type ReportItemReceivedProps = {
  item: ReportType;
  lastItemReceivedRef?: (node: Element | null) => void;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  reportPut: UseMutationResult<ReportType, Error, ReportType, unknown>;
  reportDelete: UseMutationResult<void, Error, number, unknown>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
};

const ReportItemReceived = ({
  item,
  lastItemReceivedRef,
  setErrMsgPost,
  errMsgPost,
  reportPut,
  reportDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setAttachmentsToSend,
}: ReportItemReceivedProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ReportType>(item);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    const reportToPut: ReportType = {
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
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    setProgress(true);
    const reportToPut: ReportType = {
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
      },
      onSettled: () => {
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
      const formData = new FormData();
      formData.append("content", pdfURI);
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload: AttachmentType = response.data;
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
      const formData = new FormData();
      formData.append("content", pdfURI);
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fileToSend = response.data;
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
              <SaveButton onClick={handleSave} disabled={progress} />
              <CancelButton onClick={handleCancel} disabled={progress} />
            </>
          ) : (
            <>
              {!item.acknowledged && item.assigned_staff_id === user.id && (
                <Button
                  onClick={handleAcknowledge}
                  disabled={progress}
                  label="Acknowledge"
                />
              )}
              <EditButton onClick={handleEdit} disabled={progress} />
              <Button onClick={handleSend} disabled={progress} label="Send" />
              <Button onClick={handleFax} disabled={progress} label="Fax" />
              <DeleteButton
                onClick={handleDeleteClick}
                disabled={user.id !== item.assigned_staff_id || progress}
              />
            </>
          )}
        </div>
      </td>
      <td>
        <InputTextToggle
          value={itemInfos.name}
          onChange={handleChange}
          name="name"
          editVisible={editVisible}
        />
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
            placeHolder="Choose..."
          />
        ) : (
          item.Class
        )}
      </td>
      <td>
        <InputTextToggle
          name="SubClass"
          value={itemInfos.SubClass}
          onChange={handleChange}
          editVisible={editVisible}
        />
      </td>
      <td>{timestampToDateISOTZ(item.EventDateTime)}</td>
      <td>{timestampToDateISOTZ(item.ReceivedDateTime)}</td>
      <td>
        {item.SourceAuthorPhysician?.AuthorFreeText
          ? item.SourceAuthorPhysician.AuthorFreeText
          : item.SourceAuthorPhysician?.AuthorName?.FirstName
          ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          : ""}
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
        <InputTextToggle
          name="Notes"
          value={itemInfos.Notes || ""}
          onChange={handleChange}
          editVisible={editVisible}
        />
      </td>
      <SignCell item={item} />
    </tr>
  );
};

export default ReportItemReceived;
