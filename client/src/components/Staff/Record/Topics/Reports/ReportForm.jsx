import { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { getExtension } from "../../../../../utils/files/getExtension";
import { patientIdToAssignedStaffTitleAndName } from "../../../../../utils/names/patientIdToName";
import { reportSchema } from "../../../../../validation/record/reportValidation";
import FormReport from "./FormReport";

const ReportForm = ({
  demographicsInfos,
  patientId,
  setAddVisible,
  editCounter = null,
  setErrMsgPost,
  errMsgPost,
  attachment = null,
  reportPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    Format: "Binary",
    assigned_staff_id: demographicsInfos.assigned_staff_id,
    File: attachment ? attachment.file : null,
    FileExtensionAndVersion: attachment
      ? getExtension(attachment.file.path)
      : "",
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [sentOrReceived, setSentOrReceived] = useState("Received");
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;

    if (
      name === "EventDateTime" ||
      name === "ReceivedDateTime" ||
      name === "DateTimeSent"
    ) {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: {},
        File: null,
        FileExtensionAndVersion: "",
        [name]: value,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
  };
  const handleReviewedName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        Name: { ...formDatas.ReportReviewed?.Name, [name]: value },
      },
    });
  };
  const handleReviewedOHIP = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        ReviewingOHIPPhysicianId: value,
      },
    });
  };
  const handleReviewedDate = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        DateTimeReportReviewed: dateISOToTimestampTZ(value),
      },
    });
  };
  const handleRecipientName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      RecipientName: { ...formDatas.RecipientName, [name]: value },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSentOrReceived = (e) => {
    const value = e.target.value;
    setErrMsgPost("");
    setSentOrReceived(value);
    setFormDatas({
      ...formDatas,
      AuthorFreeText:
        value === "Sent"
          ? patientIdToAssignedStaffTitleAndName(
              demographicsInfos,
              staffInfos,
              patientId
            )
          : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    const reportToPost = {
      ...formDatas,
      SourceAuthorPhysician: {
        AuthorFreeText: formDatas.AuthorFreeText,
      },
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    if (reportToPost.ReportReviewed?.Name?.FirstName) {
      reportToPost.ReportReviewed = [reportToPost.ReportReviewed];
      reportToPost.acknowledged = true;
    }
    if (sentOrReceived === "Sent") {
      reportToPost.acknowledged = true;
    }

    //Validation
    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Submission
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
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsgPost("");
    setIsLoadingFile(true);
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        const fileToUpload = await xanoPost("/upload/attachment", "staff", {
          content,
        });
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          File: fileToUpload,
          FileExtensionAndVersion: getExtension(fileToUpload.path),
          Content: {},
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
