import React from "react";
import { DemographicsType, SiteType } from "../../../../../../../types/api";
import PrescriptionFooter from "../Form/PrescriptionFooter";
import PrescriptionHeader from "../Form/PrescriptionHeader";
import PrescriptionSign from "../Form/PrescriptionSign";
import PrescriptionSubHeader from "../Form/PrescriptionSubHeader";

type PrescriptionAdditionalPageItemProps = {
  printAdditionalRefs: React.MutableRefObject<HTMLDivElement[] | null>;
  demographicsInfos: DemographicsType;
  additionalBody: string;
  page: number;
  sites: SiteType[];
  siteSelectedId: number;
  uniqueId: string;
};

const PrescriptionAdditionalPageItem = ({
  printAdditionalRefs,
  demographicsInfos,
  additionalBody,
  page,
  sites,
  siteSelectedId,
  uniqueId,
}: PrescriptionAdditionalPageItemProps) => {
  return (
    <div
      className="prescription__page prescription__page--preview"
      ref={(el) => {
        if (printAdditionalRefs.current && el)
          printAdditionalRefs.current[page] = el;
      }}
    >
      <PrescriptionHeader
        site={sites.find(({ id }) => id === siteSelectedId)}
      />
      <PrescriptionSubHeader demographicsInfos={demographicsInfos} />
      <div className="prescription__body">
        <p className="prescription__body-title">Prescription</p>
        <div className="prescription__body-content prescription__body-content--preview">
          {additionalBody}
        </div>
      </div>
      <PrescriptionFooter uniqueId={uniqueId} />
      <PrescriptionSign />
    </div>
  );
};

export default PrescriptionAdditionalPageItem;
