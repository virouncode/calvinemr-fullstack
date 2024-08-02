/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

import { useEffect } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useTopicPost } from "../../../../../hooks/reactquery/mutations/topicMutations";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsISOTZ,
} from "../../../../../utils/dates/formatDates";
import ViewSDKClient from "./ViewSDKClient";

const EformPostPdfViewer = ({
  url,
  patientId,
  patientFirstName,
  patientLastName,
  fileName,
  setAddVisible,
}) => {
  console.log("url in EformPostPdfViewer", url);
  const { user } = useUserContext();
  const careElementPost = useTopicPost("E-FORMS", patientId);
  useEffect(() => {
    const viewSDKClient = new ViewSDKClient(
      patientId,
      user.id,
      nowTZTimestamp(),
      0,
      "post",
      `${patientLastName}_${patientFirstName}_${fileName}_${timestampToDateTimeSecondsISOTZ(
        nowTZTimestamp(),
        false,
        false
      )}`,
      careElementPost,
      setAddVisible
    );
    viewSDKClient.ready().then(() => {
      /* Invoke file preview */
      viewSDKClient.previewFile(
        "pdf-div",
        {
          /* Pass the embed mode option here */
          embedMode: "FULL_WINDOW",
          defaultViewMode: "FIT_WIDTH",
          showDownloadPDF: false,
          showAnnotationTools: false,
          showLeftHandPanel: false,
          showDisabledSaveButton: true,
        },
        url
      );
      viewSDKClient.registerSaveHandler();
    });
  }, [
    careElementPost,
    fileName,
    patientFirstName,
    patientId,
    patientLastName,
    setAddVisible,
    url,
    user.id,
  ]);

  return (
    <div className="in-line-container">
      <div id="pdf-div" className="in-line-div" style={{ height: "600px" }} />
    </div>
  );
};

export default EformPostPdfViewer;
