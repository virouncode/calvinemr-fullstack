import React from "react";
import { DemographicsType, SiteType } from "../../../../../../../types/api";
import PrescriptionAdditionalPageItem from "./PrescriptionAdditionalPageItem";

type PrescriptionAdditionalPagesProps = {
  pages: number[];
  additionalBodies: string[];
  printAdditionalRefs: React.MutableRefObject<HTMLDivElement[] | null>;
  demographicsInfos: DemographicsType;
  sites: SiteType[];
  siteSelectedId: number;
  uniqueId: string;
};

const PrescriptionAdditionalPages = ({
  pages,
  additionalBodies,
  printAdditionalRefs,
  demographicsInfos,
  sites,
  siteSelectedId,
  uniqueId,
}: PrescriptionAdditionalPagesProps) => {
  return pages.map((page) => (
    <PrescriptionAdditionalPageItem
      key={page}
      printAdditionalRefs={printAdditionalRefs}
      demographicsInfos={demographicsInfos}
      additionalBody={additionalBodies[page]}
      page={page}
      sites={sites}
      siteSelectedId={siteSelectedId}
      uniqueId={uniqueId}
    />
  ));
};

export default PrescriptionAdditionalPages;
