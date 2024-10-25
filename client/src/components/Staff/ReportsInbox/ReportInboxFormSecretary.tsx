import React, { useRef, useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportPost } from "../../../hooks/reactquery/mutations/reportsMutations";
import { reportClassCT, reportFormatCT } from "../../../omdDatas/codesTables";
import { DemographicsType, ReportFormType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { handleUploadReport } from "../../../utils/files/handleUploadReport";
import { reportSchema } from "../../../validation/record/reportValidation";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import ReportViewer from "../../UI/Documents/ReportViewer";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import GenericList from "../../UI/Lists/GenericList";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import ReportsInboxPatients from "./ReportsInboxPatients";

type ReportInboxFormSecretaryProps = {
  errMsg: string;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
};

const ReportInboxFormSecretary = ({
  errMsg,
  setErrMsg,
}: ReportInboxFormSecretaryProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState<ReportFormType>({
    patient_id: 0,
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    name: "",
    Media: "",
    Format: "Binary",
    FileExtensionAndVersion: "",
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
    File: null,
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(false);
  const reportPost = useReportPost();

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setErrMsg("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;

    if (name === "EventDateTime" || name === "ReceivedDateTime") {
      value = dateISOToTimestampTZ(value);
    } else if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: { TextContent: "", Media: "" },
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
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      patient_id: patient.patient_id,
      assigned_staff_id: patient.assigned_staff_id,
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDatas({
      ...formDatas,
      Content: { TextContent: e.target.value, Media: "" },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");
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
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    if (
      staffInfos.find(({ id }) => id === formDatas.assigned_staff_id)
        ?.account_status === "Closed"
    ) {
      setErrMsg(
        "This patient's assigned practitioner is no longer working at the clinic, please assign a new practitioner to the patient in the patient's record before posting a report"
      );
      return;
    }

    setProgress(true);
    reportPost.mutate(reportToPost, {
      onSettled: () => {
        setProgress(false);
      },
    });
    if (formDatas.Format === "Binary") {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setFormDatas({
      patient_id: 0,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      name: "",
      Media: "",
      Format: "Binary",
      FileExtensionAndVersion: "",
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
      File: null,
    });
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadReport(e, setErrMsg, setIsLoadingFile, formDatas, setFormDatas);
  };

  return (
    <div
      className="reports__form"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      <form className="reports__form-content" onSubmit={handleSubmit}>
        <div className="reports__form-row reports__form-row--btns">
          <SubmitButton label="Post" disabled={isLoadingFile || progress} />
        </div>
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
          <GenericList
            label="Format"
            name="Format"
            value={formDatas.Format}
            handleChange={handleChange}
            list={reportFormatCT}
            placeHolder="Choose format..."
          />
        </div>
        <div className="reports__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion}</p>
        </div>
        {formDatas.Format === "Binary" ? (
          <div className="reports__form-row">
            <label>Content</label>
            <input
              name="Content"
              required
              type="file"
              onChange={handleUpload}
              accept=".jpeg, .jpg, .png, .pdf"
              // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="reports__form-row reports__form-row--text">
            <label htmlFor="inbox-content">Content</label>
            <textarea
              name="Content"
              value={formDatas.Content?.TextContent}
              onChange={handleContentChange}
              id="inbox-content"
            />
          </div>
        )}
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
            value={formDatas.SourceAuthorPhysician?.AuthorFreeText}
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
      <div className="reports__form-preview">
        {isLoadingFile && <LoadingParagraph />}
        {formDatas.File && <ReportViewer file={formDatas.File} />}
      </div>
    </div>
  );
};

export default ReportInboxFormSecretary;
