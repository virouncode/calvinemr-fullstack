import { UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";
import React, { useEffect, useState } from "react";
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
import { showReportTextContent } from "../../../../../utils/reports/showReportTextContent";
import { reportSchema } from "../../../../../validation/record/reportValidation";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type ReportItemSentProps = {
  item: ReportType;
  lastItemSentRef?: (node: Element | null) => void;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  reportPut: UseMutationResult<ReportType, Error, ReportType, void>;
  reportDelete: UseMutationResult<void, Error, number, void>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
};

const ReportItemSent = ({
  item,
  lastItemSentRef,
  errMsgPost,
  setErrMsgPost,
  reportPut,
  reportDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setAttachmentsToSend,
}: ReportItemSentProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
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
    const reportToPut: ReportType = {
      ...itemInfos,
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    setProgress(true);
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
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        {
          content: pdfURI,
        }
      );
      const fileToUpload: AttachmentType = response.data;
      setFileToFax({
        alias: `${item.name.split(" ").join("")}.pdf`,
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
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        {
          content: pdfURI,
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
      ref={lastItemSentRef}
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
        <GenericListToggle
          name="Class"
          value={itemInfos.Class}
          handleChange={handleChange}
          list={reportClassCT}
          editVisible={editVisible}
          placeHolder="Select a class..."
        />
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
      <td>{timestampToDateISOTZ(item.DateTimeSent)}</td>
      <td>
        {item.SourceAuthorPhysician?.AuthorFreeText
          ? item.SourceAuthorPhysician.AuthorFreeText
          : item.SourceAuthorPhysician?.AuthorName?.FirstName
          ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          : ""}
      </td>
      <td>
        {item.RecipientName?.FirstName} {item.RecipientName?.LastName}
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

export default ReportItemSent;
