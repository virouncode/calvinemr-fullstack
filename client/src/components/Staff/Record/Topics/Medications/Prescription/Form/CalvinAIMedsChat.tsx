import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSpeechRecognition } from "../../../../../../../hooks/useSpeechRecognition";
import { CalvinAITemplateType } from "../../../../../../../types/api";
import { AIMessageType } from "../../../../../../../types/app";
import { isChromeBrowser } from "../../../../../../../utils/browsers/isChromeBrowser";
import Button from "../../../../../../UI/Buttons/Button";
import FakeWindow from "../../../../../../UI/Windows/FakeWindow";
import CalvinAIChatContent from "../../../../../CalvinAIChat/CalvinAIChatContent";
import CalvinAIInput from "../../../../../CalvinAIChat/CalvinAIInput";
import CalvinAITemplates from "../../../../../CalvinAIChat/CalvinAITemplates";

type CalvinAIMedsChatProps = {
  initialMessage: string;
};

const CalvinAIMedsChat = ({ initialMessage }: CalvinAIMedsChatProps) => {
  const msgEndRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<AIMessageType[]>([]);
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
  const inputTextBeforeSpeech = useRef("");
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (autoScroll && msgEndRef.current) msgEndRef.current.scrollIntoView();
  }, [autoScroll, lastResponse]);

  useEffect(() => {
    if (!initialMessage) return;
    const sendInitialMessage = async () => {
      const updatedMessages: AIMessageType[] = [
        {
          role: "user",
          content: initialMessage,
        },
        { role: "assistant", content: "" },
      ];
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
                content: initialMessage,
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
    sendInitialMessage();
  }, [initialMessage]);

  // Event handler for user scrolling.
  const handleMouseWheel = () => {
    setAutoScroll(false);
  };

  // Add a scroll event listener to the discussion feed.
  useEffect(() => {
    const currentContent = contentRef.current;
    if (currentContent)
      currentContent.addEventListener("mousewheel", handleMouseWheel);
    return () => {
      if (currentContent)
        currentContent.removeEventListener("mousewheel", handleMouseWheel);
    };
  }, []);

  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setInputText,
    inputTextBeforeSpeech
  );

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    inputTextBeforeSpeech.current = e.target.value;
  };
  const handleAskGPT = async () => {
    handleStopSpeech();
    setInputText("");
    setAutoScroll(true);
    inputTextBeforeSpeech.current = "";
    const text = inputText;
    const updatedMessages = [...messages];
    updatedMessages.push({ role: "user", content: text });
    updatedMessages.push({ role: "assistant", content: "" });
    try {
      setIsLoading(true);
      abortController.current = new AbortController();
      const response = await fetch(`/api/openai/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
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
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
      setIsLoading(false);
    }
  };
  const handleSelectTemplate = (template: CalvinAITemplateType) => {
    setInputText(
      inputText + (inputText ? "\n\n" : "") + template.prompt + "\n"
    );
    if (inputTextRef.current) {
      inputTextRef.current.focus();
      inputTextRef.current.setSelectionRange(
        (inputText + (inputText ? "\n\n" : "") + template.prompt + "\n").length,
        (inputText + (inputText ? "\n\n" : "") + template.prompt + "\n").length
      );
      inputTextBeforeSpeech.current =
        inputText + (inputText ? "\n\n" : "") + template.prompt + "\n";
    }
  };
  const handleNew = () => {
    handleStopSpeech();
    setInputText("");
    inputTextBeforeSpeech.current = "";
    setMessages([]);
  };

  const handleStartSpeech = () => {
    if (!isChromeBrowser())
      toast.info("We recommend using Chrome for better speech recognition", {
        containerId: "A",
      });
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleStopSpeech = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };
  return (
    <>
      <div className="calvinai-chat calvinai-chat--meds">
        <CalvinAIChatContent
          messages={messages}
          msgEndRef={msgEndRef}
          contentRef={contentRef}
          isLoading={isLoading}
        />
        <div className="calvinai-chat__stop-btn">
          <span
            onClick={() => setTemplatesVisible((v) => !v)}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "10px",
              fontSize: "0.8rem",
            }}
          >
            Use template
          </span>
          <Button
            onClick={() => abortController.current?.abort()}
            label="Stop generating"
          />
          <Button onClick={handleNew} label="New conversation" />
        </div>
        <CalvinAIInput
          handleChangeInput={handleChangeInput}
          value={inputText}
          handleAskGPT={handleAskGPT}
          isLoading={isLoading}
          inputTextRef={inputTextRef}
          isListening={isListening}
          handleStopSpeech={handleStopSpeech}
          handleStartSpeech={handleStartSpeech}
        />
      </div>
      {templatesVisible && (
        <FakeWindow
          title={`CALVIN AI PROMPTS TEMPLATES`}
          width={500}
          height={600}
          x={window.innerWidth - 500}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <CalvinAITemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </>
  );
};

export default CalvinAIMedsChat;
