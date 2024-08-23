import React from "react";
import { DemographicsType, SiteType } from "../../../../../../../types/api";
import PrescriptionFooter from "../Form/PrescriptionFooter";
import PrescriptionHeader from "../Form/PrescriptionHeader";
import PrescriptionSign from "../Form/PrescriptionSign";
import PrescriptionSubHeader from "../Form/PrescriptionSubHeader";

type PrescriptionPagePreviewProps = {
  printRef: React.MutableRefObject<HTMLDivElement | null>;
  bodyRef: React.MutableRefObject<HTMLDivElement | null>;
  sites: SiteType[];
  siteSelectedId: number;
  demographicsInfos: DemographicsType;
  uniqueId: string;
  mainBody: string;
};

const PrescriptionPagePreview = ({
  printRef,
  bodyRef,
  sites,
  siteSelectedId,
  demographicsInfos,
  uniqueId,
  mainBody,
}: PrescriptionPagePreviewProps) => {
  return (
    <div
      className="prescription__page prescription__page--preview"
      ref={printRef}
    >
      <PrescriptionHeader
        site={sites.find(({ id }) => id === siteSelectedId)}
      />
      <PrescriptionSubHeader demographicsInfos={demographicsInfos} />
      <div className="prescription__body">
        <p className="prescription__body-title">Prescription</p>
        <div
          className="prescription__body-content prescription__body-content--preview"
          ref={bodyRef}
        >
          {mainBody}
        </div>
      </div>
      <PrescriptionFooter uniqueId={uniqueId} />
      <PrescriptionSign />
    </div>
  );
};

export default PrescriptionPagePreview;
