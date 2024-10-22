import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportPost } from "../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT } from "../../../omdDatas/codesTables";
import {
  DemographicsType,
  MessageAttachmentType,
  ReportFormType,
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

type ReportInboxFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialAttachment: Partial<MessageAttachmentType>;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
};

const ReportInboxForm = ({
  setAddVisible,
  initialAttachment,
  errMsgPost,
  setErrMsgPost,
}: ReportInboxFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<ReportFormType>({
    patient_id: 0,
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    name: "",
    Media: "",
    Format: "Binary",
    FileExtensionAndVersion: getExtension(initialAttachment?.file?.path),
    FilePath: "",
    Content: { TextContent: "", Media: "" },
    Class: "",
    SubClass: "",
    EventDateTime: null,
    ReceivedDateTime: null,
    SourceAuthorPhysician: {
      AuthorFreeText: "",
    },
    ReportReviewed: [],
    Notes: "",
    RecipientName: {
      FirstName: "",
      LastName: "",
    },
    DateTimeSent: null,
    acknowledged: false,
    assigned_staff_id: 0,
    File: initialAttachment?.file ?? null,
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
    if (name === "EventDateTime" || name === "ReceivedDateTime") {
      value = dateISOToTimestampTZ(value);
    } else if (name === "Format") {
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
    } else if (name === "AuthorFreeText") {
      setFormDatas({
        ...formDatas,
        SourceAuthorPhysician: {
          ...formDatas.SourceAuthorPhysician,
          AuthorFreeText: value,
        },
      });
      return;
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
    const reportToPost: ReportFormType = {
      ...formDatas,
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
      className="reports__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reports__form-content" onSubmit={handleSubmit}>
        <div className="reports__form-row reports__form-row--btns">
          <SubmitButton label="Save" disabled={progress} />
          <CancelButton onClick={handleCancel} />
        </div>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reports__form-row">
          <Input
            label="Report Name"
            name="name"
            value={formDatas.name}
            onChange={handleChange}
            id="inbox-name"
          />
        </div>
        <div className="reports__form-row">
          <ReportsInboxPatients
            isPatientChecked={isPatientChecked}
            handleCheckPatient={handleCheckPatient}
          />
        </div>
        <div className="reports__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion}</p>
        </div>
        <div className="reports__form-row">
          <GenericList
            label="Class"
            name="Class"
            value={formDatas.Class}
            handleChange={handleChange}
            list={reportClassCT}
            placeHolder="Choose..."
          />
        </div>
        <div className="reports__form-row">
          <Input
            label="Sub class"
            name="SubClass"
            value={formDatas.SubClass}
            onChange={handleChange}
            id="inbox-subclass"
          />
        </div>
        <div className="reports__form-row">
          <InputDate
            label="Date of document"
            name="EventDateTime"
            value={timestampToDateISOTZ(formDatas.EventDateTime)}
            onChange={handleChange}
            id="inbox-date"
          />
        </div>
        <div className="reports__form-row">
          <InputDate
            label="Date received"
            name="ReceivedDateTime"
            value={timestampToDateISOTZ(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            id="inbox-date-received"
          />
        </div>
        <div className="reports__form-row">
          <Input
            label="Author"
            name="AuthorFreeText"
            value={formDatas.SourceAuthorPhysician.AuthorFreeText}
            onChange={handleChange}
            id="inbox-author"
          />
        </div>
        <div className="reports__form-row reports__form-row--text">
          <label htmlFor="inbox-notes">Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes}
            onChange={handleChange}
            autoComplete="off"
            id="inbox-notes"
          />
        </div>
      </form>
      {formDatas.File && (
        <div className="reports__form-preview">
          <ReportViewer file={formDatas.File} />
        </div>
      )}
    </div>
  );
};

export default ReportInboxForm;
