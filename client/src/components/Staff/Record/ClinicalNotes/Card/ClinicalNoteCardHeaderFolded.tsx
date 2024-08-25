import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { ClinicalNoteType } from "../../../../../types/api";
import { timestampToDateTimeStrTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import TriangleIcon from "../../../../UI/Icons/TriangleIcon";

type ClinicalNoteCardHeaderFoldedProps = {
  tempFormDatas: ClinicalNoteType;
  handleClinicalHeaderClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  isChecked: (id: number) => boolean;
  clinicalNote: ClinicalNoteType;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectAll: boolean;
};

const ClinicalNoteCardHeaderFolded = ({
  tempFormDatas,
  handleClinicalHeaderClick,
  isChecked,
  clinicalNote,
  handleCheck,
  selectAll,
}: ClinicalNoteCardHeaderFoldedProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="clinical-notes__card-header clinical-notes__card-header--folded"
      onClick={handleClinicalHeaderClick}
    >
      <div className="clinical-notes__card-header--folded-title">
        <Checkbox
          onChange={handleCheck}
          checked={isChecked(clinicalNote.id) || selectAll}
          onClick={(event) => event.stopPropagation()}
        />
        <p>
          <label>
            <strong>From: </strong>
          </label>
          {staffIdToTitleAndName(staffInfos, tempFormDatas.created_by_id)}
          {` ${timestampToDateTimeStrTZ(tempFormDatas.date_created)}`}
          {" / "}
          <strong>Subject: </strong>
          {tempFormDatas.subject}
        </p>
      </div>
      <div className="clinical-notes__card-header--folded-triangle">
        <TriangleIcon color="black" rotation={180} />
      </div>
    </div>
  );
};

export default ClinicalNoteCardHeaderFolded;
