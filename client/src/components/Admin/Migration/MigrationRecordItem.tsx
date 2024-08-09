import React from "react";
import Checkbox from "../../UI/Checkbox/Checkbox";

type MigrationRecordItemProps = {
  label: string;
  handleCheckRecord: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => void;
  isRecordChecked: (id: number) => boolean;
  recordId: number;
  isLoading: boolean;
};

const MigrationRecordItem = ({
  label,
  handleCheckRecord,
  isRecordChecked,
  recordId,
  isLoading,
}: MigrationRecordItemProps) => {
  return (
    <li className="migration-export__records-list-item">
      <Checkbox
        id={label}
        onChange={(e) => handleCheckRecord(e, recordId)}
        checked={isRecordChecked(recordId)}
        disabled={recordId === 1 || isLoading}
        label={label}
      />
    </li>
  );
};

export default MigrationRecordItem;
