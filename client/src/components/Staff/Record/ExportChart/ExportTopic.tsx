import React from "react";
import {
  AttachmentType,
  DemographicsType,
  TopicExportType,
} from "../../../../types/api";
import ExportAlerts from "./ExportAlerts";
import ExportAllergies from "./ExportAllergies";
import ExportCareElements from "./ExportCareElements";
import ExportEforms from "./ExportEforms";
import ExportFamHistory from "./ExportFamHistory";
import ExportFamilyDoctors from "./ExportFamilyDoctors";
import ExportImmunizations from "./ExportImmunizations";
import ExportLetters from "./ExportLetters";
import ExportMedications from "./ExportMedications";
import ExportPastHealth from "./ExportPastHealth";
import ExportPastPrescriptions from "./ExportPastPrescriptions";
import ExportPersonalHistory from "./ExportPersonalHistory";
import ExportPreferredPharmacy from "./ExportPreferredPharmacy";
import ExportPregnancies from "./ExportPregnancies";
import ExportProblemlist from "./ExportProblemlist";
import ExportReports from "./ExportReports";
import ExportRisks from "./ExportRisks";

type ExportTopicProps = {
  topic: TopicExportType;
  patientId: number;
  demographicsInfos: DemographicsType;
  lettersFilesRef?: React.MutableRefObject<AttachmentType[]>;
  reportsFilesRef?: React.MutableRefObject<AttachmentType[]>;
  eformsFilesRef?: React.MutableRefObject<AttachmentType[]>;
  prescriptionsFilesRef?: React.MutableRefObject<AttachmentType[]>;
  reportsTextRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const ExportTopic = ({
  topic,
  patientId,
  demographicsInfos,
  lettersFilesRef,
  reportsFilesRef,
  eformsFilesRef,
  prescriptionsFilesRef,
  reportsTextRef,
}: ExportTopicProps) => {
  switch (topic) {
    case "PAST HEALTH":
      return <ExportPastHealth patientId={patientId} />;
    case "FAMILY HISTORY":
      return <ExportFamHistory patientId={patientId} />;
    case "ALERTS & SPECIAL NEEDS":
      return <ExportAlerts patientId={patientId} />;
    case "RISK FACTORS":
      return <ExportRisks patientId={patientId} />;
    case "MEDICATIONS & TREATMENTS":
      return <ExportMedications patientId={patientId} />;
    case "PAST PRESCRIPTIONS":
      return (
        <ExportPastPrescriptions
          patientId={patientId}
          prescriptionsFilesRef={
            prescriptionsFilesRef as React.MutableRefObject<AttachmentType[]>
          }
        />
      );
    case "FAMILY DOCTORS & SPECIALISTS":
      return <ExportFamilyDoctors patientId={patientId} />;
    case "PHARMACIES":
      return <ExportPreferredPharmacy demographicsInfos={demographicsInfos} />;
    case "E-FORMS":
      return (
        <ExportEforms
          eformsFilesRef={
            eformsFilesRef as React.MutableRefObject<AttachmentType[]>
          }
          patientId={patientId}
        />
      );
    case "LETTERS/REFERRALS":
      return (
        <ExportLetters
          lettersFilesRef={
            lettersFilesRef as React.MutableRefObject<AttachmentType[]>
          }
          patientId={patientId}
        />
      );
    case "PERSONAL HISTORY":
      return <ExportPersonalHistory patientId={patientId} />;
    case "CARE ELEMENTS":
      return <ExportCareElements patientId={patientId} />;
    case "PROBLEM LIST":
      return <ExportProblemlist patientId={patientId} />;
    case "PREGNANCIES":
      return <ExportPregnancies patientId={patientId} />;
    case "ALLERGIES & ADVERSE REACTIONS":
      return <ExportAllergies patientId={patientId} />;
    case "REPORTS":
      return (
        <ExportReports
          patientId={patientId}
          reportsFilesRef={
            reportsFilesRef as React.MutableRefObject<AttachmentType[]>
          }
          reportsTextRef={
            reportsTextRef as React.MutableRefObject<HTMLDivElement | null>
          }
        />
      );
    case "IMMUNIZATIONS":
      return <ExportImmunizations patientId={patientId} />;
    default:
      return <div>Unknown topic</div>;
  }
};

export default ExportTopic;
