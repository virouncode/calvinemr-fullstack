import { useRef, useState } from "react";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import { useSpeechRecognition } from "../../../../../../hooks/useSpeechRecognition";
import { toRecipientInfos } from "../../../../../../utils/letters/toRecipientInfos";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../../Billing/PatientChartHealthSearch";
import ReferringOHIPSearch from "../../../../Billing/ReferringOHIPSearch";
import LetterBody from "./LetterBody";
import LetterHeader from "./LetterHeader";
import LetterSign from "./LetterSign";
import LetterSubheader from "./LetterSubheader";

const LetterPage = ({
  sites,
  siteSelectedId,
  demographicsInfos,
  date,
  subject,
  setSubject,
  body,
  bodyRef,
  setBody,
  recipientInfos,
  setRecipientInfos,
}) => {
  const { clinic } = useClinicContext();
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const inputTextBeforeSpeech = useRef("");
  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setBody,
    inputTextBeforeSpeech
  );

  const handleClickRefOHIP = (e, doctor) => {
    setRecipientInfos(toRecipientInfos(doctor, sites, clinic));
    setRefOHIPSearchVisible(false);
  };

  const handleClickPatient = (e, patient) => {
    setRecipientInfos(toRecipientInfos(patient, sites, clinic));
    setPatientSearchVisible(false);
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

  return (
    <>
      <div className="letter__page">
        <LetterHeader site={sites.find(({ id }) => id === siteSelectedId)} />
        <LetterSubheader
          recipientInfos={recipientInfos}
          setRecipientInfos={setRecipientInfos}
          setRefOHIPSearchVisible={setRefOHIPSearchVisible}
          setPatientSearchVisible={setPatientSearchVisible}
          subject={subject}
          setSubject={setSubject}
          demographicsInfos={demographicsInfos}
          date={date}
        />
        <LetterBody
          body={body}
          bodyRef={bodyRef}
          setBody={setBody}
          handleStartSpeech={handleStartSpeech}
          handleStopSpeech={handleStopSpeech}
          isListening={isListening}
          inputTextBeforeSpeech={inputTextBeforeSpeech}
        />
        <LetterSign />
      </div>
      {refOHIPSearchVisible && (
        <FakeWindow
          title="DOCTORS DATABASE"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setRefOHIPSearchVisible}
        >
          <ReferringOHIPSearch handleClickRefOHIP={handleClickRefOHIP} />
        </FakeWindow>
      )}
      {patientSearchVisible && (
        <FakeWindow
          title="PATIENTS DATABASE"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setPatientSearchVisible}
        >
          <PatientChartHealthSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
    </>
  );
};

export default LetterPage;
