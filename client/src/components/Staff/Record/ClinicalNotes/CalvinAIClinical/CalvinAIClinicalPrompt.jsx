import { useState } from "react";
import { toast } from "react-toastify";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import Button from "../../../../UI/Buttons/Button";
import AddAIAttachments from "./AddAIAttachments";
import AddAIReports from "./AddAIReports";

const CalvinAIClinicalPrompt = ({
  setMessages,
  setChatVisible,
  setLastResponse,
  abortController,
  attachments,
  demographicsInfos,
  msgText,
  setMsgText,
}) => {
  const [isLoadingAttachmentText, setIsLoadingAttachmentText] = useState(false);
  const [isLoadingReportText, setIsLoadingReportText] = useState(false);
  const [attachmentsTextsToAdd, setAttachmentsTextsToAdd] = useState([]);
  const [reportsTextToAdd, setReportsTextsToAdd] = useState([]);
  const {
    data: reports,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("REPORTS", demographicsInfos.patient_id);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setMsgText({ ...msgText, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedMessages = [
      {
        role: "user",
        content: `${msgText.intro}\n\n${msgText.body}\n\n${
          attachments.length > 0 ? msgText.attachments + "\n\n" : ""
        }${msgText.reports ? msgText.reports + "\n\n" : ""}${msgText.question}`,
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
                msgText.intro +
                msgText.body +
                msgText.attachments +
                msgText.reports +
                msgText.question,
            },
          ],
        }),
        signal: abortController.current.signal,
      });
      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      const test = true;
      while (test) {
        const { done, value } = await reader.read();
        if (done) break;
        updatedMessages[updatedMessages.length - 1].content += value;
        setMessages([...updatedMessages]);
        setLastResponse((prev) => prev + value);
      }
    } catch (err) {
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
        value={msgText.intro}
        name="intro"
        id="introduction"
      />
      <label htmlFor="body">Symptoms</label>
      <textarea
        className="calvinai-prompt__body-textarea"
        onChange={handleChange}
        value={msgText.body}
        name="body"
        id="body"
      />
      <label>Attachments infos (read-only)</label>
      <textarea
        className="calvinai-prompt__attachments-textarea"
        readOnly
        value={msgText.attachments}
      />
      <label>Reports infos (read-only)</label>
      <textarea
        className="calvinai-prompt__reports-textarea"
        readOnly
        value={msgText.reports}
      />
      <label htmlFor="calvinai-question">Question</label>
      <textarea
        className="calvinai-prompt__conclusion-textarea"
        onChange={handleChange}
        value={msgText.question}
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
              msgText={msgText}
              setMsgText={setMsgText}
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
            msgText={msgText}
            setMsgText={setMsgText}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoadingAttachmentText || isLoadingReportText}
          label="Submit to CalvinAI"
        />
      </div>
    </div>
  );
};

export default CalvinAIClinicalPrompt;
