
import { toast } from "react-toastify";
import { extractToText } from "../../../../../utils/extractText/extractToText";
import { toAnonymousText } from "../../../../../utils/extractText/toAnonymousText";

const AddAIReportItem = ({
  report,
  reportsAddedIds,
  setReportsAddedIds,
  reportsTextToAdd,
  setReportsTextsToAdd,
  demographicsInfos,
  isLoadingReportText,
  setIsLoadingReportText,
  isLoadingAttachmentText,
  msgText,
  setMsgText,
  lastItemRef = null,
}) => {
  const isChecked = (id) => reportsAddedIds.includes(id);
  const handleChange = async (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let reportsTextsToAddUpdated;
    if (checked) {
      setReportsAddedIds([...reportsAddedIds, id]);
      let textToAdd;
      if (report.Format === "Binary") {
        setIsLoadingReportText(true);
        try {
          const response = await extractToText(
            report.File?.url,
            report.File?.mime
          );
          textToAdd = response.join("");
        } catch (err) {
          toast.error(
            `Error while extracting text from the document:${err.message}`,
            { containerId: "A" }
          );
          return;
        }
      } else {
        textToAdd = report.Content.TextContent;
      }
      textToAdd = toAnonymousText(textToAdd, demographicsInfos);
      reportsTextsToAddUpdated = [
        ...reportsTextToAdd,
        { id, content: textToAdd, date_created: report.date_created },
      ];
      setReportsTextsToAdd(reportsTextsToAddUpdated);
      setIsLoadingReportText(false);
    } else {
      let updatedIds = [...reportsAddedIds];
      updatedIds = updatedIds.filter((documentId) => documentId !== id);
      setReportsAddedIds(updatedIds);
      reportsTextsToAddUpdated = [...reportsTextToAdd].filter(
        (text) => text.id !== id
      );
      setReportsTextsToAdd(reportsTextsToAddUpdated);
    }
    setMsgText({
      ...msgText,
      reports: reportsTextsToAddUpdated
        .map(({ content }) => content)
        .join("\n\n"),
    });
  };

  return (
    <li className="calvinai-prompt__report-item" ref={lastItemRef}>
      <input
        type="checkbox"
        id={report.id}
        checked={isChecked(report.id)}
        onChange={handleChange}
        disabled={isLoadingReportText || isLoadingAttachmentText}
      />
      <label htmlFor={`calvinai-report${report.id}`}>{report.name}</label>
    </li>
  );
};

export default AddAIReportItem;
