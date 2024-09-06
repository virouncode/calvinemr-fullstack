import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import { CalvinAITemplateType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import FakeWindow from "../../UI/Windows/FakeWindow";
import CalvinAIChatContent from "./CalvinAIChatContent";
import CalvinAIInput from "./CalvinAIInput";
import CalvinAITemplates from "./CalvinAITemplates";
import CalvinAIChatTemplates from "./ClavinAIChatTemplates";

type AIMessage = { role: string; content: string };

const CalvinAIChat = () => {
  //Hooks
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const msgEndRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
  const inputTextBeforeSpeech = useRef("");

  useEffect(() => {
    if (autoScroll) {
      if (msgEndRef.current) msgEndRef.current.scrollIntoView();
    }
  }, [autoScroll, lastResponse]);

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

  const handleMouseWheel = () => {
    setAutoScroll(false);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    inputTextBeforeSpeech.current = e.target.value;
  };

  const handleStartSpeech = () => {
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

  const handleAskGPT = async () => {
    handleStopSpeech();
    setInputText("");
    setAutoScroll(true);
    inputTextBeforeSpeech.current = "";
    const text = inputText;
    const updatedMessages: AIMessage[] = [...messages];
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
      setIsLoading(false);
      if (err instanceof Error)
        toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
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
    }
    inputTextBeforeSpeech.current =
      inputText + (inputText ? "\n\n" : "") + template.prompt + "\n";
  };

  const handleNew = () => {
    handleStopSpeech();
    setMessages([]);
    setInputText("");
    inputTextBeforeSpeech.current = "";
  };
  return (
    <>
      <div className="calvinai__container">
        <div className="calvinai__chat">
          <CalvinAIChatContent
            messages={messages}
            msgEndRef={msgEndRef}
            contentRef={contentRef}
            isLoading={isLoading}
          />
          <div className="calvinai__chat-btns">
            <span
              className="calvinai__chat-templates-btn"
              onClick={() => setTemplatesVisible((v) => !v)}
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
        <CalvinAIChatTemplates handleSelectTemplate={handleSelectTemplate} />
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

export default CalvinAIChat;
