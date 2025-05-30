import React, { useState } from "react";
import { toast } from "react-toastify";
import { useReports } from "../../../../../hooks/reactquery/queries/reportsQueries";
import {
  ClinicalNoteAttachmentType,
  DemographicsType,
} from "../../../../../types/api";
import { AIMessageType, PromptTextType } from "../../../../../types/app";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import AddAIAttachments from "./AddAIAttachments";
import AddAIReports from "./AddAIReports";

type CalvinAIClinicalPromptProps = {
  setMessages: React.Dispatch<React.SetStateAction<AIMessageType[]>>;
  setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLastResponse: React.Dispatch<React.SetStateAction<string>>;
  abortController: React.MutableRefObject<AbortController | null>;
  attachments: ClinicalNoteAttachmentType[];
  demographicsInfos: DemographicsType;
  promptText: PromptTextType;
  setPromptText: React.Dispatch<React.SetStateAction<PromptTextType>>;
};

const CalvinAIClinicalPrompt = ({
  setMessages,
  setChatVisible,
  setLastResponse,
  abortController,
  attachments,
  demographicsInfos,
  promptText,
  setPromptText,
}: CalvinAIClinicalPromptProps) => {
  //Hooks
  const [isLoadingAttachmentText, setIsLoadingAttachmentText] = useState(false);
  const [isLoadingReportText, setIsLoadingReportText] = useState(false);
  const [attachmentsTextsToAdd, setAttachmentsTextsToAdd] = useState<
    { id: number; content: string; date_created: number }[]
  >([]);
  const [reportsTextToAdd, setReportsTextsToAdd] = useState<
    { id: number; content: string; date_created: number }[]
  >([]);
  //Queries
  const {
    data: reports,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useReports(demographicsInfos.patient_id);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setPromptText({ ...promptText, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedMessages: AIMessageType[] = [
      {
        role: "user",
        content: `${promptText.intro}\n\n${promptText.body}\n\n${
          attachments.length > 0 ? promptText.attachments + "\n\n" : ""
        }${promptText.reports ? promptText.reports + "\n\n" : ""}${
          promptText.question
        }`,
      },
      { role: "assistant", content: "" },
    ];
    setChatVisible(true);
    try {
      abortController.current = new AbortController();
      const response = await fetch(`/api/openai/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                promptText.intro +
                promptText.body +
                promptText.attachments +
                promptText.reports +
                promptText.question,
            },
          ],
        }),
        signal: abortController.current.signal,
      });
      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      const test = true;
      while (test && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        updatedMessages[updatedMessages.length - 1].content += value;
        setMessages([...updatedMessages]);
        setLastResponse((prev) => prev + value);
      }
    } catch (err) {
      if (err instanceof Error)
        toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
    }
  };
  return (
    <div className="calvinai-prompt">
      <h2 className="calvinai-prompt__title">Prepare prompt to CalvinAI</h2>
      <label htmlFor="introduction">Introduction</label>
      <textarea
        className="calvinai-prompt__intro-textarea"
        onChange={handleChange}
        value={promptText.intro}
        name="intro"
        id="introduction"
      />
      <label htmlFor="body">Symptoms</label>
      <textarea
        className="calvinai-prompt__body-textarea"
        onChange={handleChange}
        value={promptText.body}
        name="body"
        id="body"
      />
      <label>Attachments infos (read-only)</label>
      <textarea
        className="calvinai-prompt__attachments-textarea"
        readOnly
        value={promptText.attachments}
      />
      <label>Reports infos (read-only)</label>
      <textarea
        className="calvinai-prompt__reports-textarea"
        readOnly
        value={promptText.reports}
      />
      <label htmlFor="calvinai-question">Question</label>
      <textarea
        className="calvinai-prompt__conclusion-textarea"
        onChange={handleChange}
        value={promptText.question}
        name="question"
        id="calvinai-question"
      />
      <div className="calvinai-prompt__footer">
        <div className="calvinai-prompt__add">
          {attachments.length ? (
            <AddAIAttachments
              attachments={attachments}
              demographicsInfos={demographicsInfos}
              isLoadingAttachmentText={isLoadingAttachmentText}
              setIsLoadingAttachmentText={setIsLoadingAttachmentText}
              isLoadingReportText={isLoadingReportText}
              attachmentsTextsToAdd={attachmentsTextsToAdd}
              setAttachmentsTextsToAdd={setAttachmentsTextsToAdd}
              promptText={promptText}
              setPromptText={setPromptText}
            />
          ) : null}
          <AddAIReports
            reports={reports}
            isPending={isPending}
            error={error}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching}
            demographicsInfos={demographicsInfos}
            isLoadingReportText={isLoadingReportText}
            setIsLoadingReportText={setIsLoadingReportText}
            isLoadingAttachmentText={isLoadingAttachmentText}
            reportsTextToAdd={reportsTextToAdd}
            setReportsTextsToAdd={setReportsTextsToAdd}
            promptText={promptText}
            setPromptText={setPromptText}
          />
        </div>
        <div className="calvinai-prompt__btns">
          <SaveButton
            onClick={handleSubmit}
            disabled={isLoadingAttachmentText || isLoadingReportText}
            label="Submit to CalvinAI"
          />
        </div>
      </div>
    </div>
  );
};

export default CalvinAIClinicalPrompt;
