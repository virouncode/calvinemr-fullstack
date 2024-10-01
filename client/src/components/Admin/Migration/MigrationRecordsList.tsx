import React from "react";
import { recordCategories } from "../../../utils/migration/exports/recordCategories";
import Checkbox from "../../UI/Checkbox/Checkbox";
import MigrationRecordItem from "./MigrationRecordItem";

type MigrationRecordsListProps = {
  isRecordIdChecked: (id: number) => boolean;
  handleCheckRecordId: (
    e: React.ChangeEvent<HTMLInputElement>,
    recordId: number
  ) => void;
  handleCheckAllRecordsIds: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllRecordsIdsChecked: () => boolean;
  isLoading: boolean;
};

const MigrationRecordsList = ({
  isRecordIdChecked,
  handleCheckRecordId,
  handleCheckAllRecordsIds,
  isAllRecordsIdsChecked,
  isLoading,
}: MigrationRecordsListProps) => {
  return (
    <ul className="migration__export-records-list">
      <li className="migration__export-records-list-item">
        <Checkbox
          id="all-records"
          name="all-records"
          onChange={handleCheckAllRecordsIds}
          checked={isAllRecordsIdsChecked()}
          disabled={isLoading}
          label="All"
        />
      </li>
      {recordCategories.map((record) => (
        <MigrationRecordItem
          key={record.id}
          label={record.label}
          handleCheckRecord={handleCheckRecordId}
          isRecordChecked={isRecordIdChecked}
          recordId={record.id}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
};

export default MigrationRecordsList;
