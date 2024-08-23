import React from "react";
import {
  DemographicsType,
  MedType,
  SiteType,
} from "../../../../../../../types/api";
import PrescriptionBody from "./PrescriptionBody";
import PrescriptionFooter from "./PrescriptionFooter";
import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionSign from "./PrescriptionSign";
import PrescriptionSubHeader from "./PrescriptionSubHeader";

type PrescriptionPageProps = {
  sites: SiteType[];
  siteSelectedId: number;
  demographicsInfos: DemographicsType;
  addedMeds: Partial<MedType>[];
  setAddedMeds: React.Dispatch<React.SetStateAction<Partial<MedType>[]>>;
  uniqueId: string;
  setFreeText: React.Dispatch<React.SetStateAction<string>>;
  freeText: string;
};
const PrescriptionPage = ({
  sites,
  siteSelectedId,
  demographicsInfos,
  addedMeds,
  setAddedMeds,
  uniqueId,
  setFreeText,
  freeText,
}: PrescriptionPageProps) => {
  return (
    <div className="prescription__container">
      <div className="prescription__page">
        <PrescriptionHeader
          site={sites.find(({ id }) => id === siteSelectedId)}
        />
        <PrescriptionSubHeader demographicsInfos={demographicsInfos} />
        <PrescriptionBody
          addedMeds={addedMeds}
          setAddedMeds={setAddedMeds}
          freeText={freeText}
          setFreeText={setFreeText}
        />
        <PrescriptionFooter uniqueId={uniqueId} />
        <PrescriptionSign />
      </div>
    </div>
  );
};

export default PrescriptionPage;
