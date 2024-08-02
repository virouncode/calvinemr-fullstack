import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
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
import ExportPreferrerPharmacy from "./ExportPreferrerPharmacy";
import ExportPregnancies from "./ExportPregnancies";
import ExportProblemlist from "./ExportProblemlist";
import ExportReports from "./ExportReports";
import ExportRisks from "./ExportRisks";

const ExportTopic = ({
  topic,
  patientId,
  demographicsInfos,
  lettersFilesRef = null,
  reportsFilesRef = null,
  eformsFilesRef = null,
  prescriptionsFilesRef = null,
  reportsTextRef = null,
}) => {
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    topic,
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const topicDatas = data.pages.flatMap((page) => page.items);

  if (topic === "PAST HEALTH")
    return <ExportPastHealth topicDatas={topicDatas} />;
  if (topic === "FAMILY HISTORY")
    return <ExportFamHistory topicDatas={topicDatas} />;
  if (topic === "ALERTS & SPECIAL NEEDS")
    return <ExportAlerts topicDatas={topicDatas} />;
  if (topic === "RISK FACTORS") return <ExportRisks topicDatas={topicDatas} />;
  if (topic === "MEDICATIONS & TREATMENTS")
    return <ExportMedications topicDatas={topicDatas} />;
  if (topic === "PAST PRESCRIPTIONS")
    return (
      <ExportPastPrescriptions
        topicDatas={topicDatas}
        prescriptionsFilesRef={prescriptionsFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "FAMILY DOCTORS & SPECIALISTS") return <ExportFamilyDoctors />;
  if (topic === "PHARMACIES")
    return <ExportPreferrerPharmacy demographicsInfos={demographicsInfos} />;
  if (topic === "E-FORMS")
    return (
      <ExportEforms
        topicDatas={topicDatas}
        eformsFilesRef={eformsFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "LETTERS/REFERRALS")
    return (
      <ExportLetters
        topicDatas={topicDatas}
        lettersFilesRef={lettersFilesRef}
        hasNextPage={hasNextPage}
      />
    );
  if (topic === "PERSONAL HISTORY")
    return <ExportPersonalHistory topicDatas={topicDatas} />;
  if (topic === "CARE ELEMENTS")
    return <ExportCareElements topicDatas={topicDatas} />;
  if (topic === "PROBLEM LIST")
    return <ExportProblemlist topicDatas={topicDatas} />;
  if (topic === "PREGNANCIES")
    return <ExportPregnancies topicDatas={topicDatas} />;
  if (topic === "ALLERGIES & ADVERSE REACTIONS")
    return <ExportAllergies topicDatas={topicDatas} />;
  if (topic === "REPORTS")
    return (
      <ExportReports
        topicDatas={topicDatas}
        reportsFilesRef={reportsFilesRef}
        hasNextPage={hasNextPage}
        reportsTextRef={reportsTextRef}
      />
    );
  if (topic === "IMMUNIZATIONS")
    return <ExportImmunizations topicDatas={topicDatas} />;
  return <div></div>;
};

export default ExportTopic;
