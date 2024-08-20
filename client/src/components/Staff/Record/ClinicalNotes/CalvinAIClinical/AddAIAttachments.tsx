import React, { useState } from "react";
import {
  ClinicalNoteAttachmentType,
  DemographicsType,
} from "../../../../../types/api";
import { PromptTextType } from "../../../../../types/app";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import AddAIAttachmentItem from "./AddAIAttachmentItem";

type AddAIAttachmentsProps = {
  attachments: ClinicalNoteAttachmentType[];
  demographicsInfos: DemographicsType;
  isLoadingAttachmentText: boolean;
  setIsLoadingAttachmentText: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingReportText: boolean;
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
  promptText: PromptTextType;
  setPromptText: React.Dispatch<React.SetStateAction<PromptTextType>>;
};

const AddAIAttachments = ({
  attachments,
  demographicsInfos,
  isLoadingAttachmentText,
  setIsLoadingAttachmentText,
  isLoadingReportText,
  attachmentsTextsToAdd,
  setAttachmentsTextsToAdd,
  promptText,
  setPromptText,
}: AddAIAttachmentsProps) => {
  const [attachmentsAddedIds, setAttachmentsAddedIds] = useState<number[]>([]);

  return (
    <div className="calvinai-prompt__attachments">
      <p className="calvinai-prompt__attachments-title">
        Add attachments datas
        {isLoadingAttachmentText && <CircularProgressSmall />}
      </p>
      {attachments.map((attachment) => (
        <AddAIAttachmentItem
          key={attachment.id}
          attachment={attachment}
          attachmentsAddedIds={attachmentsAddedIds}
          setAttachmentsAddedIds={setAttachmentsAddedIds}
          attachmentsTextsToAdd={attachmentsTextsToAdd}
          setAttachmentsTextsToAdd={setAttachmentsTextsToAdd}
          isLoadingAttachmentText={isLoadingAttachmentText}
          setIsLoadingAttachmentText={setIsLoadingAttachmentText}
          isLoadingReportText={isLoadingReportText}
          demographicsInfos={demographicsInfos}
          promptText={promptText}
          setPromptText={setPromptText}
        />
      ))}
    </div>
  );
};

export default AddAIAttachments;
