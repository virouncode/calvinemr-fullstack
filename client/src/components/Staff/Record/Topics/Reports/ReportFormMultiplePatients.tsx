import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useReportsPostBatch } from "../../../../../hooks/reactquery/mutations/reportsMutations";
import {
  DemographicsType,
  MessageAttachmentType,
  ReportFormType,
  ReportType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { getExtension } from "../../../../../utils/files/getExtension";
import { handleUploadReport } from "../../../../../utils/files/handleUploadReport";
import { patientIdToAssignedStaffTitleAndName } from "../../../../../utils/names/patientIdToAssignedStaffName";
import { reportMultipleSchema } from "../../../../../validation/record/reportValidation";
import FormReport from "./FormReport";

type ReportFormMultiplePatientsProps = {
  demographicsInfos: DemographicsType[];
  patientsIds: number[];
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  initialAttachment: Partial<MessageAttachmentType>;
};

const ReportFormMultiplePatients = ({
  demographicsInfos,
  patientsIds,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  initialAttachment,
}: ReportFormMultiplePatientsProps) => {
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
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [sentOrReceived, setSentOrReceived] = useState("Received");
  const [progress, setProgress] = useState(false);

  const reportsPost = useReportsPostBatch();

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
        Format: value,
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
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDatas({
      ...formDatas,
      Content: {
        TextContent: e.target.value,
        Media: formDatas.Content?.Media ?? "",
      },
    });
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
            formDatas.ReportReviewed?.[0]?.DateTimeReportReviewed ?? null,
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
            formDatas.ReportReviewed?.[0]?.DateTimeReportReviewed ?? null,
        },
      ],
    });
  };
  const handleReviewedDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: [
        {
          ...formDatas.ReportReviewed?.[0],
          DateTimeReportReviewed: dateISOToTimestampTZ(value),
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

  const handleRecipientName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      RecipientName: {
        ...formDatas.RecipientName,
        [name]: value,
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSentOrReceived = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setErrMsgPost("");
    setSentOrReceived(value);
    setFormDatas({
      ...formDatas,
      SourceAuthorPhysician: {
        ...formDatas.SourceAuthorPhysician,
        AuthorFreeText: "",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsgPost("");
    //Validation
    try {
      await reportMultipleSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    const reportsToPost: Partial<ReportType>[] = [];

    for (const patientId of patientsIds) {
      const reportToPost: ReportFormType = {
        ...formDatas,
        patient_id: patientId,
        assigned_staff_id: demographicsInfos.find(
          ({ patient_id }) => patient_id === patientId
        )?.assigned_staff_id as number,
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
      if (reportToPost.ReportReviewed?.[0].Name?.FirstName) {
        reportToPost.acknowledged = true;
      }
      if (sentOrReceived === "Sent") {
        reportToPost.acknowledged = true;
      }
      //Submission
      reportsToPost.push(reportToPost);
    }
    reportsPost.mutate(reportsToPost, {
      onSuccess: () => {
        setProgress(false);
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadReport(
      e,
      setErrMsgPost,
      setIsLoadingFile,
      formDatas,
      setFormDatas
    );
  };

  return (
    <FormReport
      errMsgPost={errMsgPost}
      formDatas={formDatas}
      isLoadingFile={isLoadingFile}
      progress={progress}
      sentOrReceived={sentOrReceived}
      initialAttachment={initialAttachment}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleUpload={handleUpload}
      handleSentOrReceived={handleSentOrReceived}
      handleChange={handleChange}
      handleContentChange={handleContentChange}
      handleReviewedName={handleReviewedName}
      handleReviewedDate={handleReviewedDate}
      handleReviewedOHIP={handleReviewedOHIP}
      handleRecipientName={handleRecipientName}
    />
  );
};

export default ReportFormMultiplePatients;
