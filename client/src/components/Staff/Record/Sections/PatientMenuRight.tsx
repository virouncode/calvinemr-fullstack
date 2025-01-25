import React from "react";
import { DemographicsType, PatientRecordType } from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicAgeCalculator from "./PatientTopicAgeCalculator";
import PatientTopicCycleCalculator from "./PatientTopicCycleCalculator";
import PatientTopicLabels from "./PatientTopicLabels";
import PatientTopicReports from "./PatientTopicReports";

type PatientMenuRightProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
  contentsVisible: boolean;
  patientRecord: PatientRecordType;
};

const PatientMenuRight = ({
  demographicsInfos,
  patientId,
  contentsVisible,
  patientRecord,
}: PatientMenuRightProps) => {
  const [
    pastHealth,
    familyHistory,
    relationships,
    alerts,
    risks,
    medications,
    prescriptions,
    doctors,
    eforms,
    consentForms,
    reminders,
    letters,
    groups,
    personalHistory,
    careElements,
    problemList,
    pregnancies,
    cycles,
    allergies,
    reportsReceived,
    reportsSent,
    immunizations,
    appointments,
    checklist,
    messages,
    externalMessages,
    todos,
  ] = patientRecord;
  return (
    <div className="patient-record__menu">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="PERSONAL HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="right"
        data={personalHistory}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="CARE ELEMENTS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={careElements}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="PROBLEM LIST"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={problemList}
      />
      {demographicsInfos.Gender !== "M" && (
        <PatientTopic
          textColor="#FEFEFE"
          backgroundColor="#01ba95"
          topic="PREGNANCIES"
          patientId={patientId}
          contentsVisible={contentsVisible}
          patientName={toPatientName(demographicsInfos)}
          side="right"
          data={pregnancies}
        />
      )}
      {demographicsInfos.Gender !== "M" && (
        <PatientTopic
          textColor="#FEFEFE"
          backgroundColor="#2c8c99"
          topic="CYCLES"
          patientId={patientId}
          contentsVisible={contentsVisible}
          patientName={toPatientName(demographicsInfos)}
          demographicsInfos={demographicsInfos}
          side="right"
          data={cycles}
        />
      )}
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="ALLERGIES & ADVERSE REACTIONS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={allergies}
      />
      <PatientTopicAgeCalculator
        textColor="#FEFEFE"
        backgroundColor="#931621"
        patientDob={demographicsInfos.DateOfBirth as number}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      {demographicsInfos.Gender !== "M" && (
        <PatientTopicCycleCalculator
          textColor="#FEFEFE"
          backgroundColor="#db4a9c"
          patientDob={demographicsInfos.DateOfBirth as number}
          patientName={toPatientName(demographicsInfos)}
          side="right"
        />
      )}
      <PatientTopicReports
        textColor="#FEFEFE"
        backgroundColor="#e3afce"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        reportsReceived={reportsReceived}
        reportsSent={reportsSent}
      />
      <PatientTopicLabels
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        contentsVisible={contentsVisible}
        side="right"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="IMMUNIZATIONS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        patientDob={demographicsInfos.DateOfBirth as number}
        side="right"
        data={immunizations}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="APPOINTMENTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={appointments}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#009da5"
        topic="CHECKLIST"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        demographicsInfos={demographicsInfos}
        data={checklist}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="MESSAGES ABOUT PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={messages}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#848484"
        topic="MESSAGES WITH PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={externalMessages}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#8fc195"
        topic="TO-DOS ABOUT PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        data={todos}
      />
    </div>
  );
};
export default PatientMenuRight;
