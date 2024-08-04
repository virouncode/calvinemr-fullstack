import Checkbox from "../../UI/Checkbox/Checkbox";

const MigrationRecordItem = ({
  label,
  handleCheckRecord,
  isRecordChecked,
  recordId,
  isLoading,
}) => {
  return (
    <li className="migration-export__records-list-item">
      <Checkbox
        id={label}
        name={label}
        onChange={(e) => handleCheckRecord(e, recordId)}
        checked={isRecordChecked(recordId)}
        disabled={recordId === 1 || isLoading}
        label={label}
      />
    </li>
  );
};

export default MigrationRecordItem;
