import React from "react";
import { toast } from "react-toastify";
import {
  ClinicalNoteAttachmentType,
  DemographicsType,
} from "../../../../../types/api";
import { PromptTextType } from "../../../../../types/app";
import { extractToText } from "../../../../../utils/extractText/extractToText";
import { toAnonymousText } from "../../../../../utils/extractText/toAnonymousText";
import Checkbox from "../../../../UI/Checkbox/Checkbox";

type AddAIAttachmentItemProps = {
  attachment: ClinicalNoteAttachmentType;
  attachmentsAddedIds: number[];
  setAttachmentsAddedIds: React.Dispatch<React.SetStateAction<number[]>>;
  attachmentsTextsToAdd: {
    id: number;
    content: string;
    date_created: number;
  }[];
  setAttachmentsTextsToAdd: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        content: string;
        date_created: number;
      }[]
    >
  >;
  isLoadingAttachmentText: boolean;
  setIsLoadingAttachmentText: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingReportText: boolean;
  demographicsInfos: DemographicsType;
  promptText: PromptTextType;
  setPromptText: React.Dispatch<React.SetStateAction<PromptTextType>>;
};

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
  promptText,
  setPromptText,
}: AddAIAttachmentItemProps) => {
  const isChecked = (id: number) => attachmentsAddedIds.includes(id);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) {
      setAttachmentsAddedIds([...attachmentsAddedIds, id]);
      setIsLoadingAttachmentText(true);
      try {
        let textToAdd = (
          await extractToText(attachment.file.url, attachment.file.mime)
        ).join("");

        textToAdd = toAnonymousText(textToAdd, demographicsInfos);
        setAttachmentsTextsToAdd([
          ...attachmentsTextsToAdd,
          { id, content: textToAdd, date_created: attachment.date_created },
        ]);
        setIsLoadingAttachmentText(false);
        setPromptText({
          ...promptText,
          attachments:
            "Here is further information that you may use: " +
            "\n\n" +
            [
              ...attachmentsTextsToAdd,
              { id, content: textToAdd, date_created: attachment.date_created },
            ]
              .map(({ content }) => content)
              .join("\n\n"),
        });
      } catch (err) {
        if (err instanceof Error)
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
      setAttachmentsTextsToAdd(
        attachmentsTextsToAdd.filter((text) => text.id !== id)
      );
      setPromptText({
        ...promptText,
        attachments:
          "Here is further information that you may use: " +
          "\n\n" +
          attachmentsTextsToAdd
            .filter((text) => text.id !== id)
            .map(({ content }) => content)
            .join("\n\n"),
      });
    }
  };

  return (
    <div className="calvinai-prompt__attachment-item">
      <Checkbox
        id={`calvinai-attachment${attachment.id}`}
        onChange={handleChange}
        checked={isChecked(attachment.id as number)}
        disabled={isLoadingAttachmentText || isLoadingReportText}
        label={attachment.alias}
      />
    </div>
  );
};

export default AddAIAttachmentItem;
