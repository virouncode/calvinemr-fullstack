import { recordCategories } from "../../../utils/migration/exports/recordCategories";
import Checkbox from "../../UI/Checkbox/Checkbox";
import MigrationRecordItem from "./MigrationRecordItem";

const MigrationRecordsList = ({
  isRecordIdChecked,
  handleCheckRecordId,
  handleCheckAllRecordsIds,
  isAllRecordsIdsChecked,
  isLoading,
}) => {
  return (
    <ul className="migration-export__records-list">
      <li className="migration-export__records-list-item">
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
          name={record.name}
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
