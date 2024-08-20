import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import {
  AlertType,
  AllergyType,
  AttachmentType,
  CareElementType,
  DemographicsType,
  EformType,
  FamilyHistoryType,
  ImmunizationType,
  LetterType,
  MedType,
  PastHealthType,
  PersonalHistoryType,
  PregnancyType,
  PrescriptionType,
  ProblemListType,
  ReportType,
  RiskFactorType,
} from "../../../../types/api";
import { TopicType } from "../../../../types/app";
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
  topic: TopicType;
  patientId: number;
  demographicsInfos: DemographicsType;
  lettersFilesRef: React.MutableRefObject<AttachmentType[]>;
  reportsFilesRef: React.MutableRefObject<AttachmentType[]>;
  eformsFilesRef: React.MutableRefObject<AttachmentType[]>;
  prescriptionsFilesRef: React.MutableRefObject<AttachmentType[]>;
  reportsTextRef: React.MutableRefObject<HTMLDivElement | null>;
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
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    topic,
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const topicDatas = data.pages.flatMap((page) => page.items);

  if (topic === "PAST HEALTH")
    return <ExportPastHealth topicDatas={topicDatas as PastHealthType[]} />;
  if (topic === "FAMILY HISTORY")
    return <ExportFamHistory topicDatas={topicDatas as FamilyHistoryType[]} />;
  if (topic === "ALERTS & SPECIAL NEEDS")
    return <ExportAlerts topicDatas={topicDatas as AlertType[]} />;
  if (topic === "RISK FACTORS")
    return <ExportRisks topicDatas={topicDatas as RiskFactorType[]} />;
  if (topic === "MEDICATIONS & TREATMENTS")
    return <ExportMedications topicDatas={topicDatas as MedType[]} />;
  if (topic === "PAST PRESCRIPTIONS")
    return (
      <ExportPastPrescriptions
        topicDatas={topicDatas as PrescriptionType[]}
        prescriptionsFilesRef={prescriptionsFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "FAMILY DOCTORS & SPECIALISTS")
    return <ExportFamilyDoctors patientId={patientId} />;
  if (topic === "PHARMACIES")
    return <ExportPreferredPharmacy demographicsInfos={demographicsInfos} />;
  if (topic === "E-FORMS")
    return (
      <ExportEforms
        topicDatas={topicDatas as EformType[]}
        eformsFilesRef={eformsFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "LETTERS/REFERRALS")
    return (
      <ExportLetters
        topicDatas={topicDatas as LetterType[]}
        lettersFilesRef={lettersFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "PERSONAL HISTORY")
    return (
      <ExportPersonalHistory topicDatas={topicDatas as PersonalHistoryType[]} />
    );
  if (topic === "CARE ELEMENTS")
    return <ExportCareElements topicDatas={topicDatas as CareElementType[]} />;
  if (topic === "PROBLEM LIST")
    return <ExportProblemlist topicDatas={topicDatas as ProblemListType[]} />;
  if (topic === "PREGNANCIES")
    return <ExportPregnancies topicDatas={topicDatas as PregnancyType[]} />;
  if (topic === "ALLERGIES & ADVERSE REACTIONS")
    return <ExportAllergies topicDatas={topicDatas as AllergyType[]} />;
  if (topic === "REPORTS")
    return (
      <ExportReports
        topicDatas={topicDatas as ReportType[]}
        reportsFilesRef={reportsFilesRef}
        hasNextPage={hasNextPage}
        reportsTextRef={reportsTextRef}
      />
    );
  if (topic === "IMMUNIZATIONS")
    return (
      <ExportImmunizations topicDatas={topicDatas as ImmunizationType[]} />
    );
  return <div></div>;
};

export default ExportTopic;
