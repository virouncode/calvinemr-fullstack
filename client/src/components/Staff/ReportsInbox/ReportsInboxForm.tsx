import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportPost } from "../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT } from "../../../omdDatas/codesTables";
import {
  DemographicsType,
  MessageAttachmentType,
  ReportFormType,
  ReportType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
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

type ReportsInboxFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialAttachment: Partial<MessageAttachmentType>;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
};

const ReportsInboxForm = ({
  setAddVisible,
  initialAttachment,
  errMsgPost,
  setErrMsgPost,
}: ReportsInboxFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<ReportFormType>({
    name: "",
    patient_id: 0,
    assigned_staff_id: 0,
    Media: "Download",
    Format: "Binary",
    FileExtensionAndVersion: getExtension(initialAttachment.file?.path),
    File: initialAttachment.file ?? null,
    AuthorFreeText: "",
    Content: {
      TextContent: "",
      Media: "",
    },
    Class: "",
    SubClass: "",
    EventDateTime: null,
    ReceivedDateTime: null,
    Notes: "",
  });
  const [progress, setProgress] = useState(false);
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
    if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: {
          TextContent: "",
          Media: "",
        },
        File: null,
        FileExtensionAndVersion: "",
        Format: value as string,
      });
      return;
    }
    if (name === "EventDateTime" || name === "ReceivedDateTime") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const isPatientChecked = (id: number) => {
    return formDatas.patient_id === id;
  };

  const handleCheckPatient = (
    e: React.ChangeEvent<HTMLInputElement>,
    patient: DemographicsType
  ) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      patient_id: patient.patient_id,
      assigned_staff_id: patient.assigned_staff_id,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsgPost("");
    const reportToPost: Partial<ReportType> = {
      ...formDatas,
      SourceAuthorPhysician: {
        AuthorFreeText: formDatas.AuthorFreeText,
        AuthorName: { FirstName: "", LastName: "" },
      },
      acknowledged: false,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    setProgress(true);
    reportPost.mutate(reportToPost, {
      onSuccess: () => {
        setAddVisible(false);
      },
      onSettled: (error) => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setAddVisible(false);
  };

  return (
    <div
      className="reportsinbox__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reportsinbox__form-content" onSubmit={handleSubmit}>
        <div className="reportsinbox__form-row reportsinbox__form-row--btns">
          <SubmitButton label="Save" disabled={progress} />
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
      {formDatas.File && (
        <div className="reportsinbox__form-preview">
          <ReportViewer file={formDatas.File} />
        </div>
      )}
    </div>
  );
};

export default ReportsInboxForm;
