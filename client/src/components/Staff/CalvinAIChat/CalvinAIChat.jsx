import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import CalvinAIChatContent from "./CalvinAIChatContent";
import CalvinAIInput from "./CalvinAIInput";
import CalvinAIChatTemplates from "./ClavinAIChatTemplates";

const CalvinAIChat = () => {
  const msgEndRef = useRef(null);
  const contentRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const abortController = useRef(null);
  const inputTextRef = useRef(null);
  const inputTextBeforeSpeech = useRef("");

  useEffect(() => {
    if (autoScroll) {
      msgEndRef.current.scrollIntoView();
    }
  }, [autoScroll, lastResponse]);

  // Event handler for user scrolling.
  const handleMouseWheel = () => {
    setAutoScroll(false);
  };

  // Add a scroll event listener to the discussion feed.
  useEffect(() => {
    const currentContent = contentRef.current;
    currentContent.addEventListener("mousewheel", handleMouseWheel, {
      passive: true,
    });
    return () => {
      currentContent.removeEventListener("mousewheel", handleMouseWheel);
    };
  }, []);

  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setInputText,
    inputTextBeforeSpeech
  );

  const handleChangeInput = (e) => {
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        updatedMessages[updatedMessages.length - 1].content += value;
        setMessages([...updatedMessages]);
        setLastResponse((prev) => prev + value);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
    }
  };

  const handleSelectTemplate = (e, template) => {
    e.preventDefault();
    setInputText(
      inputText + (inputText ? "\n\n" : "") + template.prompt + "\n"
    );
    inputTextRef.current.focus();
    inputTextRef.current.setSelectionRange(
      (inputText + (inputText ? "\n\n" : "") + template.prompt + "\n").length,
      (inputText + (inputText ? "\n\n" : "") + template.prompt + "\n").length
    );
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
    <div className="calvinai-container">
      <div className="calvinai-chat">
        <CalvinAIChatContent
          messages={messages}
          msgEndRef={msgEndRef}
          contentRef={contentRef}
          isLoading={isLoading}
        />
        <div className="calvinai-chat__stop-btn">
          <button
            onClick={() => abortController.current.abort()}
            style={{ marginRight: "5px" }}
          >
            Stop generating
          </button>
          <button onClick={handleNew}>New conversation</button>
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
  );
};

export default CalvinAIChat;
