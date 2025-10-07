import React from "react";
import ReactQuill from "react-quill-new";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { ClinicalNoteType } from "../../../../../types/api";
import { timestampToDateTimeSecondsStrTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

type ClinicalNoteOverviewCardProps = {
  clinicalNote: ClinicalNoteType;
  targetRef?: (node: Element | null) => void;
};

const ClinicalNoteOverviewCard = ({
  clinicalNote,
  targetRef,
}: ClinicalNoteOverviewCardProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__overview-card" ref={targetRef}>
      <div className="clinical-notes__overview-card-row">
        <label>From:</label>
        <p>{staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Date:</label>
        <p>{timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Subject:</label>
        <p>{clinicalNote.subject}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Body:</label>
        <div className="clinical-notes__card-body-quill clinical-notes__card-body-quill--overview">
          <ReactQuill
            theme="snow"
            readOnly={true}
            value={clinicalNote.MyClinicalNotesContent}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalNoteOverviewCard;
