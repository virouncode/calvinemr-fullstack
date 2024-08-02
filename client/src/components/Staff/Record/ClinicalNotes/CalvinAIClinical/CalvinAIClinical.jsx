import { useRef, useState } from "react";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { getAgeTZ } from "../../../../../utils/dates/formatDates";
import StaffAIAgreement from "../../../Agreement/StaffAIAgreement";
import CalvinAIClinicalDiscussion from "./CalvinAIClinicalDiscussion";
import CalvinAIClinicalPrompt from "./CalvinAIClinicalPrompt";

const CalvinAIClinical = ({
  attachments,
  initialBody,
  demographicsInfos,
  setEditVisible,
  setAIContent,
  setAIVisible,
}) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [start, setStart] = useState(true);
  const [msgText, setMsgText] = useState({
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

  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "",
    },
  ]);
  const [lastResponse, setLastResponse] = useState("");
  const abortControllerAI = useRef(null);

  return (
    <>
      {!chatVisible ? (
        <CalvinAIClinicalPrompt
          messages={messages}
          setMessages={setMessages}
          setChatVisible={setChatVisible}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
          attachments={attachments}
          initialBody={initialBody}
          demographicsInfos={demographicsInfos}
          introMsg={introMsg}
          setIntroMsg={setIntroMsg}
          msgText={msgText}
          setMsgText={setMsgText}
        />
      ) : !start ? (
        <StaffAIAgreement setStart={setStart} setChatVisible={setChatVisible} />
      ) : (
        <CalvinAIClinicalDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
          setEditVisible={setEditVisible}
          setAIContent={setAIContent}
          setAIVisible={setAIVisible}
        />
      )}
    </>
  );
};

export default CalvinAIClinical;
