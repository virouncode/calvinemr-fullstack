import React, { useRef, useState } from "react";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import {
  ClinicalNoteAttachmentType,
  DemographicsType,
} from "../../../../../types/api";
import { AIMessageType, PromptTextType } from "../../../../../types/app";
import { getAgeTZ } from "../../../../../utils/dates/formatDates";
import CalvinAIClinicalDiscussion from "./CalvinAIClinicalDiscussion";
import CalvinAIClinicalPrompt from "./CalvinAIClinicalPrompt";

type CalvinAIClinicalProps = {
  attachments: ClinicalNoteAttachmentType[];
  initialBody: string;
  demographicsInfos: DemographicsType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAIRewritedText: React.Dispatch<React.SetStateAction<string>>;
  setAIVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalvinAIClinical = ({
  attachments,
  initialBody,
  demographicsInfos,
  setEditVisible,
  setAIRewritedText,
  setAIVisible,
}: CalvinAIClinicalProps) => {
  // const [start, setStart] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [promptText, setPromptText] = useState<PromptTextType>({
    intro: `Hello I'm a doctor. My patient is a ${getAgeTZ(
      demographicsInfos.DateOfBirth
    )} year-old ${toCodeTableName(
      genderCT,
      demographicsInfos.Gender
    )} with the following symptoms:`,
    body: initialBody,
    attachments: "Here is further information that you may use: ",
    reports: "",
    question: `What questions should I ask for a focused medical history and review of systems? Format this way : "[item]: ", one per line.

How should I conduct a focused physical exam ?  Format this way : "[item]: ", one per line.
    
What tests do you suggest ?  Format this way : "[item]: ", one per line.
    
What are the 5 most probable diagnosis (add the probability percentage) ?
    
What is the treatment of the most probable diagnosis ? Be specific, add drug names, doses and duration.
    
What is the recommended follow-up ?
    
What is the degree of emergency in a scale on 1 to 10 writing "x out of 10 (10 being the most urgent)"
    
Write all you answers in clear bullet points for more clarity.`,
  });
  const [introMsg, setIntroMsg] = useState(
    `Hello I'm a doctor. My patient is a ${getAgeTZ(
      demographicsInfos.DateOfBirth
    )} year-old ${toCodeTableName(
      genderCT,
      demographicsInfos.Gender
    )} with the following symptoms:`
  );
  const [messages, setMessages] = useState<AIMessageType[]>([
    {
      role: "user",
      content: "",
    },
  ]);
  const [lastResponse, setLastResponse] = useState("");
  const abortControllerAI = useRef<AbortController | null>(null);

  return (
    <>
      {!chatVisible ? (
        <CalvinAIClinicalPrompt
          setMessages={setMessages}
          setChatVisible={setChatVisible}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
          attachments={attachments}
          demographicsInfos={demographicsInfos}
          promptText={promptText}
          setPromptText={setPromptText}
        />
      ) : (
        // !start ? (
        //   <StaffAIAgreement setStart={setStart} setChatVisible={setChatVisible} />) :

        <CalvinAIClinicalDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
          setEditVisible={setEditVisible}
          setAIRewritedText={setAIRewritedText}
          setAIVisible={setAIVisible}
        />
      )}
    </>
  );
};

export default CalvinAIClinical;
