import React from "react";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type ExportRecordItemProps = {
  recordName: string;
  isRecordSelected: (recordName: string) => boolean;
  handleCheckRecord: (
    e: React.ChangeEvent<HTMLInputElement>,
    recordName: string
  ) => void;
};

const ExportRecordItem = ({
  recordName,
  isRecordSelected,
  handleCheckRecord,
}: ExportRecordItemProps) => {
  return (
    <li className="export-chart__records-item">
      <Checkbox
        id={recordName}
        checked={isRecordSelected(recordName)}
        onChange={(e) => handleCheckRecord(e, recordName)}
        disabled={recordName === "DEMOGRAPHICS"}
        label={recordName}
        mr={10}
      />
    </li>
  );
};

export default ExportRecordItem;
