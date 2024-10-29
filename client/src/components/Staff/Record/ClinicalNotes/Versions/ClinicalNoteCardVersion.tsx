import React from "react";
import ReactQuill from "react-quill-new";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  ClinicalNoteLogType,
  ClinicalNoteType,
} from "../../../../../types/api";
import { timestampToDateTimeSecondsStrTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

type ClinicalNoteCardVersionProps = {
  version: ClinicalNoteLogType | ClinicalNoteType;
};

const ClinicalNoteCardVersion = ({ version }: ClinicalNoteCardVersionProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__card">
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, version.created_by_id)}
          </p>
          <p>
            Signed on{" "}
            {`${timestampToDateTimeSecondsStrTZ(
              version.date_updated || version.date_created
            )}`}
          </p>
        </div>
        <div className="clinical-notes__card-header-row">
          <div>
            <label>
              <strong>Subject: </strong>
            </label>
            {version.subject}
          </div>
          <div>
            <label>
              <strong>Version: </strong>
            </label>
            {"V" + version.version_nbr.toString()}
          </div>
        </div>
      </div>
      <div className="clinical-notes__card-body">
        <div className="clinical-notes__card-body-quill">
          <ReactQuill
            theme="snow"
            readOnly={true}
            value={version.MyClinicalNotesContent}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalNoteCardVersion;
