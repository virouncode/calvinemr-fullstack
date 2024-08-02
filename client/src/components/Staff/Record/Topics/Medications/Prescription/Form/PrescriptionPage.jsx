
import PrescriptionBody from "./PrescriptionBody";
import PrescriptionFooter from "./PrescriptionFooter";
import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionSign from "./PrescriptionSign";
import PrescriptionSubHeader from "./PrescriptionSubHeader";

const PrescriptionPage = ({
  sites,
  siteSelectedId,
  demographicsInfos,
  addedMeds,
  setAddedMeds,
  uniqueId,
  setFreeText,
  freeText,
  bodyRef,
}) => {
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
          bodyRef={bodyRef}
        />
        <PrescriptionFooter uniqueId={uniqueId} />
        <PrescriptionSign />
      </div>
    </div>
  );
};

export default PrescriptionPage;
