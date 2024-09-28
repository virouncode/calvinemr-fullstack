import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import { useSpeechRecognition } from "../../../../../../hooks/useSpeechRecognition";
import {
  DemographicsType,
  DoctorType,
  SiteType,
  StaffType,
} from "../../../../../../types/api";
import { isChromeBrowser } from "../../../../../../utils/browsers/isChromeBrowser";
import { toRecipientInfos } from "../../../../../../utils/letters/toRecipientInfos";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../../Billing/PatientChartHealthSearch";
import ReferringOHIPSearch from "../../../../Billing/ReferringOHIPSearch";
import LetterBody from "./LetterBody";
import LetterHeader from "./LetterHeader";
import LetterSign from "./LetterSign";
import LetterSubheader from "./LetterSubheader";

type LetterPageProps = {
  sites: SiteType[];
  siteSelectedId: number;
  demographicsInfos: DemographicsType;
  dateStr: string;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  body: string;
  bodyRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  recipientInfos: string;
  setRecipientInfos: React.Dispatch<React.SetStateAction<string>>;
};

const LetterPage = ({
  sites,
  siteSelectedId,
  demographicsInfos,
  dateStr,
  subject,
  setSubject,
  body,
  bodyRef,
  setBody,
  recipientInfos,
  setRecipientInfos,
}: LetterPageProps) => {
  //Hooks
  const { clinic } = useClinicContext();
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const inputTextBeforeSpeech = useRef("");
  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setBody,
    inputTextBeforeSpeech
  );

  const handleClickRefOHIP = (doctor: StaffType | DoctorType) => {
    setRecipientInfos(toRecipientInfos(doctor, sites, clinic));
    setRefOHIPSearchVisible(false);
  };

  const handleClickPatient = (patient: DemographicsType) => {
    setRecipientInfos(toRecipientInfos(patient, sites, clinic));
    setPatientSearchVisible(false);
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
          dateStr={dateStr}
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
