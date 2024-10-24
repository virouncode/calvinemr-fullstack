import React from "react";
import { DemographicsType } from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicDemographics from "./PatientTopicDemographics";
import PatientTopicDoctors from "./PatientTopicDoctors";
import PatientTopicGroups from "./PatientTopicGroups";

type PatientMenuLeftProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
  contentsVisible: boolean;
};

const PatientMenuLeft = ({
  demographicsInfos,
  patientId,
  contentsVisible,
}: PatientMenuLeftProps) => {
  return (
    <div className="patient-record__menu">
      <PatientTopicDemographics
        demographicsInfos={demographicsInfos}
        patientId={patientId}
        patientName={toPatientName(demographicsInfos)}
        textColor="#FEFEFE"
        backgroundColor="#495867"
        side="left"
        contentsVisible={contentsVisible}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="PAST HEALTH"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="FAMILY HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="RELATIONSHIPS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALERTS & SPECIAL NEEDS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="RISK FACTORS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="MEDICATIONS & TREATMENTS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#e3afce"
        topic="PAST PRESCRIPTIONS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopicDoctors
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="PHARMACIES"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="E-FORMS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#009da5"
        topic="CONSENT FORMS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="REMINDERS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#848484"
        topic="LETTERS/REFERRALS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopicGroups
        textColor="#FEFEFE"
        backgroundColor="#8fc195"
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
      />
    </div>
  );
};

export default PatientMenuLeft;
