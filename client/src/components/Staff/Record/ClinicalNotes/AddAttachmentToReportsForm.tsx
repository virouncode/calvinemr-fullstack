import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useReportPost } from "../../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT } from "../../../../omdDatas/codesTables";
import { ClinicalNoteAttachmentType, ReportType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { getExtension } from "../../../../utils/files/getExtension";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SubmitButton from "../../../UI/Buttons/SubmitButton";
import ReportViewer from "../../../UI/Documents/ReportViewer";
import Input from "../../../UI/Inputs/Input";
import InputDate from "../../../UI/Inputs/InputDate";
import GenericList from "../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";

type AddToReportsFormProps = {
  attachment: ClinicalNoteAttachmentType;
  patientId: number;
  date: number;
  setAddToReports: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddAttachmentToReportsForm = ({
  attachment,
  patientId,
  date,
  setAddToReports,
}: AddToReportsFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState<Partial<ReportType>>({
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
  //Queries
  const reportPost = useReportPost();

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (
      name === "EventDateTime" ||
      name === "ReceivedDateTime" ||
      name === "DateTimeSent"
    ) {
      if (!value) return;
      value = dateISOToTimestampTZ(value);
    } else if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: { TextContent: "", Media: "" },
        File: null,
        FileExtensionAndVersion: "",
        Format: value,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleReviewedName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: [
        {
          ...formDatas.ReportReviewed?.[0],
          Name: {
            ...(formDatas.ReportReviewed?.[0]?.Name ?? {
              FirstName: "",
              LastName: "",
            }),
            [name]: value,
          },
          ReviewingOHIPPhysicianId:
            formDatas.ReportReviewed?.[0]?.ReviewingOHIPPhysicianId ?? "",
          DateTimeReportReviewed:
            formDatas.ReportReviewed?.[0]?.DateTimeReportReviewed ?? Date.now(),
        },
      ],
    });
  };

  const handleReviewedOHIP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: [
        {
          ...formDatas.ReportReviewed?.[0],
          ReviewingOHIPPhysicianId: value,
          Name: formDatas.ReportReviewed?.[0]?.Name ?? {
            FirstName: "",
            LastName: "",
          },
          DateTimeReportReviewed:
            formDatas.ReportReviewed?.[0]?.DateTimeReportReviewed ?? Date.now(),
        },
      ],
    });
  };

  const handleReviewedDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setFormDatas({
      ...formDatas,
      ReportReviewed: [
        {
          ...formDatas.ReportReviewed?.[0],
          DateTimeReportReviewed: dateISOToTimestampTZ(value) as number,
          Name: formDatas.ReportReviewed?.[0]?.Name ?? {
            FirstName: "",
            LastName: "",
          },
          ReviewingOHIPPhysicianId:
            formDatas.ReportReviewed?.[0]?.ReviewingOHIPPhysicianId ?? "",
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Formatting
    const reportToPost: Partial<ReportType> = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    if (formDatas.ReportReviewed?.[0]?.Name?.FirstName) {
      reportToPost.acknowledged = true;
    }
    //Submissions
    reportPost.mutate(reportToPost, {
      onSuccess: () => {
        setAddToReports(false);
      },
    });
  };

  const handleCancel = () => {
    setAddToReports(false);
  };

  return (
    <div className="reports__form">
      <form className="reports__content" onSubmit={handleSubmit}>
        <div className="reports__row reports__row--btns">
          <SubmitButton label="Save" />
          <CancelButton onClick={handleCancel} />
        </div>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reports__row">
          <Input
            label="Name"
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
          <GenericList
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
            label="Class"
            noneOption={false}
          />
        </div>
        <div className="reports__row">
          <Input
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            label="Sub class"
            id="subclass"
          />
        </div>
        <div className="reports__row">
          <InputDate
            label="Date of document"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            id="date-of-doc"
          />
        </div>
        <div className="reports__row">
          <InputDate
            label="Date received"
            name="ReceivedDateTime"
            value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            id="date-received"
          />
        </div>
        <div className="reports__row">
          <Input
            name="AuthorFreeText"
            value={formDatas.SourceAuthorPhysician?.AuthorFreeText || ""}
            onChange={handleChange}
            label="Author"
            id="author"
          />
        </div>
        <div className="reports__row reports__row--special">
          <label>Reviewed by</label>
          <div>
            <div className="reports__subrow">
              <Input
                name="FirstName"
                value={formDatas.ReportReviewed?.[0].Name?.FirstName || ""}
                onChange={handleReviewedName}
                label="First name"
                id="reviewed-first-name"
              />
            </div>
            <div className="reports__subrow">
              <Input
                name="LastName"
                value={formDatas.ReportReviewed?.[0].Name?.LastName || ""}
                onChange={handleReviewedName}
                label="Last name"
                id="reviewed-last-name"
              />
            </div>
            <div className="reports__subrow">
              <Input
                name="ReviewingOHIPPhysicianId"
                value={
                  formDatas.ReportReviewed?.[0].ReviewingOHIPPhysicianId || ""
                }
                onChange={handleReviewedOHIP}
                label="OHIP#"
                id="ohip"
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
      {formDatas.File && (
        <div className="reports__preview">
          <ReportViewer file={formDatas.File} />
        </div>
      )}
    </div>
  );
};

export default AddAttachmentToReportsForm;
