import { toast } from "react-toastify";
import { extractToText } from "../../../../../utils/extractText/extractToText";
import { toAnonymousText } from "../../../../../utils/extractText/toAnonymousText";

const AddAIAttachmentItem = ({
  attachment,
  attachmentsAddedIds,
  setAttachmentsAddedIds,
  attachmentsTextsToAdd,
  setAttachmentsTextsToAdd,
  isLoadingAttachmentText,
  setIsLoadingAttachmentText,
  isLoadingReportText,
  demographicsInfos,
  msgText,
  setMsgText,
}) => {
  //HANDLERS
  const isChecked = (id) => attachmentsAddedIds.includes(id);
  const handleChange = async (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let attachmentsTextsToAddUpdated;
    if (checked) {
      setAttachmentsAddedIds([...attachmentsAddedIds, id]);
      setIsLoadingAttachmentText(true);
      try {
        let textToAdd = (
          await extractToText(attachment.file.url, attachment.file.mime)
        ).join("");

        textToAdd = toAnonymousText(textToAdd, demographicsInfos);

        attachmentsTextsToAddUpdated = [
          ...attachmentsTextsToAdd,
          { id, content: textToAdd, date_created: attachment.date_created },
        ];
        setAttachmentsTextsToAdd(attachmentsTextsToAddUpdated);
        setIsLoadingAttachmentText(false);
      } catch (err) {
        toast.error(
          `Error while extracting text from the document:${err.message}`,
          { containerId: "A" }
        );
        setIsLoadingAttachmentText(false);
        return;
      }
    } else {
      let updatedIds = [...attachmentsAddedIds];
      updatedIds = updatedIds.filter((attachmentId) => attachmentId !== id);
      setAttachmentsAddedIds(updatedIds);
      attachmentsTextsToAddUpdated = [...attachmentsTextsToAdd].filter(
        (text) => text.id !== id
      );
      setAttachmentsTextsToAdd(attachmentsTextsToAddUpdated);
    }
    setMsgText({
      ...msgText,
      attachments:
        "Here is further information that you may use: " +
        "\n\n" +
        attachmentsTextsToAddUpdated.map(({ content }) => content).join("\n\n"),
    });
  };

  return (
    <div className="calvinai-prompt__attachment-item">
      <input
        type="checkbox"
        id={attachment.id}
        checked={isChecked(attachment.id)}
        onChange={handleChange}
        disabled={isLoadingAttachmentText || isLoadingReportText}
      />
      <label htmlFor={`calvinai-attachment${attachment.id}`}>
        {attachment.alias}
      </label>
    </div>
  );
};

export default AddAIAttachmentItem;
