import Checkbox from "../../../../../UI/Checkbox/Checkbox";

const LetterAddReportItem = ({
  report,
  reportsAddedIds,
  setReportsAddedIds,
  lastItemRef = null,
  setAttachments,
}) => {
  const isChecked = (id) => reportsAddedIds.includes(id);

  const handleChange = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setReportsAddedIds([...reportsAddedIds, report.id]);
      setAttachments((a) => [
        ...a,
        {
          file: report.File,
          alias: report.name,
          date_created: report.date_created,
          created_by_id: report.created_by_id,
          created_by_user_type: "staff",
          type: "report",
        },
      ]);
    } else {
      setReportsAddedIds(
        reportsAddedIds.filter((reportId) => reportId !== report.id)
      );
      setAttachments((a) => a.filter((item) => item.alias !== report.name));
    }
  };

  return (
    <li className="letter__options-reports-item" ref={lastItemRef}>
      <Checkbox
        id={report.name}
        onChange={handleChange}
        checked={isChecked(report.id)}
        label={report.name}
      />
    </li>
  );
};

export default LetterAddReportItem;
