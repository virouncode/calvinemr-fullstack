/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

import React, { useEffect } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useTopicPut } from "../../../../../hooks/reactquery/mutations/topicMutations";
import { EformType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsISOTZ,
} from "../../../../../utils/dates/formatDates";
import ViewSDKClient from "./ViewSDKClient";

type EformEditPdfViewerProps = {
  url: string;
  patientId: number;
  patientFirstName: string;
  patientLastName: string;
  fileName: string;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  eform: EformType;
};

const EformEditPdfViewer = ({
  url,
  patientId,
  patientFirstName,
  patientLastName,
  fileName,
  setEditVisible,
  eform,
}: EformEditPdfViewerProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const eformPut = useTopicPut("E-FORMS", patientId);

  useEffect(() => {
    const viewSDKClient = new ViewSDKClient(
      patientId,
      user.id,
      nowTZTimestamp(),
      eform,
      "put",
      patientLastName
        ? `${patientLastName}_${patientFirstName}_${fileName}_${timestampToDateTimeSecondsISOTZ(
            nowTZTimestamp(),
            false,
            false
          )}`
        : fileName,
      eformPut,
      setEditVisible
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
    eformPut,
    eform,
    fileName,
    patientFirstName,
    patientId,
    patientLastName,
    setEditVisible,
    url,
    user.id,
  ]);

  return (
    <div className="in-line-container" style={{ marginTop: "40px" }}>
      <div id="pdf-div" className="in-line-div" style={{ height: "720px" }} />
    </div>
  );
};

export default EformEditPdfViewer;
