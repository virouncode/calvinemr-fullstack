
import PrescriptionAdditionalPageItem from "./PrescriptionAdditionalPageItem";

const PrescriptionAdditionalPages = ({
  pages,
  additionalBodies,
  printAdditionalRefs,
  demographicsInfos,
  sites,
  siteSelectedId,
  uniqueId,
}) => {
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
