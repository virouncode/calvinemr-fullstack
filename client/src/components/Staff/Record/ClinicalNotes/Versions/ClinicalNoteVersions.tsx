import React from "react";
import {
  ClinicalNoteLogType,
  ClinicalNoteType,
} from "../../../../../types/api";
import ClinicalNoteCardVersion from "./ClinicalNoteCardVersion";

type ClinicalNotesVersionsProps = {
  versions: ClinicalNoteLogType[];
  clinicalNote: ClinicalNoteType;
};
const ClinicalNotesVersions = ({
  versions,
  clinicalNote,
}: ClinicalNotesVersionsProps) => {
  return (
    <div className="clinical-notes__versions">
      <ClinicalNoteCardVersion version={clinicalNote} />
      {versions
        .sort((a, b) => b.version_nbr - a.version_nbr)
        .map((version) => (
          <ClinicalNoteCardVersion version={version} key={version.id} />
        ))}
    </div>
  );
};

export default ClinicalNotesVersions;
