import React from "react";
import ReactQuill from "react-quill-new";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { ClinicalNoteType } from "../../../../types/api";
import {
  timestampToDateTimeSecondsStrTZ,
  timestampToDateTimeStrTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

type ExportClinicalNoteCardProps = {
  clinicalNote: ClinicalNoteType;
};

const ExportClinicalNoteCard = ({
  clinicalNote,
}: ExportClinicalNoteCardProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__card clinical-notes__card--print">
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}
            {` ${timestampToDateTimeStrTZ(clinicalNote.date_created)}`}
          </p>
        </div>
        <div className="clinical-notes__card-header-row">
          <div>
            <label>
              <strong>Subject: </strong>
            </label>
            {clinicalNote.subject}
          </div>
          <div>
            <label>
              <strong>Version: </strong>
            </label>
            {"V" + clinicalNote.version_nbr.toString()}
          </div>
        </div>
      </div>
      <div className="clinical-notes__card-body">
        <div className="clinical-notes__card-body-quill clinical-notes__card-body-quill--print">
          <ReactQuill
            theme="snow"
            readOnly={true}
            value={clinicalNote.MyClinicalNotesContent}
          />
        </div>
      </div>
      <div className="clinical-notes__card-sign">
        <p style={{ padding: "0 10px" }}>
          Created by{" "}
          {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)} on{" "}
          {timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}
        </p>
        {clinicalNote.date_updated && (
          <p style={{ padding: "0 10px" }}>
            Updated on{" "}
            {timestampToDateTimeSecondsStrTZ(clinicalNote.date_updated)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExportClinicalNoteCard;
