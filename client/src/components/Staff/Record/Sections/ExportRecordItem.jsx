import Checkbox from "../../../UI/Checkbox/Checkbox";

const ExportRecordItem = ({
  recordName,
  isRecordSelected,
  handleCheckRecord,
}) => {
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
