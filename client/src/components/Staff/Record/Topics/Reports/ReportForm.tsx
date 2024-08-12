import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  DemographicsType,
  MessageAttachmentType,
  ReportType,
} from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { getExtension } from "../../../../../utils/files/getExtension";
import { patientIdToAssignedStaffTitleAndName } from "../../../../../utils/names/patientIdToAssignedStaffName";
import { reportSchema } from "../../../../../validation/record/reportValidation";
import FormReport from "./FormReport";

type ReportFormProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editCounter?: { current: number };
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  attachment: MessageAttachmentType;
  reportPost: UseMutationResult<ReportType, Error, ReportType, void>;
};

const ReportForm = ({
  demographicsInfos,
  patientId,
  setAddVisible,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  attachment,
  reportPost,
}: ReportFormProps) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState<ReportType>({
    patient_id: patientId,
    Format: "Binary",
    assigned_staff_id: demographicsInfos.assigned_staff_id,
    File: attachment ? attachment.file : null,
    FileExtensionAndVersion: getExtension(attachment.file.path) ?? "",
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [sentOrReceived, setSentOrReceived] = useState("Received");
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number = e.target.value;
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
        Content: { TextContent: "", Media: "" },
        File: null,
        FileExtensionAndVersion: "",
        [name]: value,
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
        ...(formDatas.RecipientName ?? { FirstName: "", LastName: "" }),
        [name]: value,
      },
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
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
        ...(formDatas.SourceAuthorPhysician ?? {
          AuthorName: { FirstName: "", LastName: "" },
        }),
        AuthorFreeText:
          value === "Sent"
            ? patientIdToAssignedStaffTitleAndName(
                demographicsInfos,
                staffInfos,
                patientId
              )
            : "",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsgPost("");

    const reportToPost: ReportType = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      created_by_id: user?.id,
    };

    if (formDatas.ReportReviewed?.[0]?.Name?.FirstName) {
      reportToPost.acknowledged = true;
    }
    if (sentOrReceived === "Sent") {
      reportToPost.acknowledged = true;
    }

    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    setProgress(true);
    reportPost.mutate(reportToPost, {
      onSuccess: () => {
        if (editCounter) editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsgPost("");
    setIsLoadingFile(true);

    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }

    setIsLoadingFile(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (e) => {
      const content = e.target?.result;
      try {
        const fileToUpload = await xanoPost("/upload/attachment", "staff", {
          content,
        });
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          File: fileToUpload,
          FileExtensionAndVersion: getExtension(fileToUpload.path),
          Content: { TextContent: "", Media: "" },
        });
      } catch (err) {
        setIsLoadingFile(false);
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };

  return (
    <FormReport
      errMsgPost={errMsgPost}
      formDatas={formDatas}
      isLoadingFile={isLoadingFile}
      progress={progress}
      sentOrReceived={sentOrReceived}
      attachment={attachment}
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

export default ReportForm;
