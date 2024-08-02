import { toPatientName } from "../../../../utils/names/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicReports from "./PatientTopicReports";

const PatientMenuRight = ({
  demographicsInfos,
  patientId,
  contentsVisible,
  loadingPatient,
  errPatient,
}) => {
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
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="CARE ELEMENTS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="PROBLEM LIST"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
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
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="AGE CALCULATOR"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopicReports
        textColor="#FEFEFE"
        backgroundColor="#e3afce"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="LABELS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
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
        patientDob={demographicsInfos.DateOfBirth}
        side="right"
        loadingPatient={loadingPatient}
        errPatient={errPatient}
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
      />
    </div>
  );
};
export default PatientMenuRight;
