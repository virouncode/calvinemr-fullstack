const ExportRecordItem = ({
  recordName,
  isRecordSelected,
  handleCheckRecord,
}) => {
  return (
    <li className="export-chart__records-item">
      <input
        type="checkbox"
        checked={isRecordSelected(recordName)}
        onChange={(e) => handleCheckRecord(e, recordName)}
        id={recordName}
        disabled={recordName === "DEMOGRAPHICS"}
      />
      <label htmlFor={recordName}>{recordName}</label>
    </li>
  );
};

export default ExportRecordItem;
