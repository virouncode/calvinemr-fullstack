const MigrationRecordItem = ({
  label,
  handleCheckRecord,
  isRecordChecked,
  recordId,
  isLoading,
}) => {
  return (
    <li className="migration-export__records-list-item">
      <input
        type="checkbox"
        onChange={(e) => handleCheckRecord(e, recordId)}
        id={label}
        checked={isRecordChecked(recordId)}
        disabled={recordId === 1 || isLoading}
      />
      <label htmlFor={label}>{label}</label>
    </li>
  );
};

export default MigrationRecordItem;
