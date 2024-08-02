import PrescriptionFooter from "../Form/PrescriptionFooter";
import PrescriptionHeader from "../Form/PrescriptionHeader";
import PrescriptionSign from "../Form/PrescriptionSign";
import PrescriptionSubHeader from "../Form/PrescriptionSubHeader";

const PrescriptionPagePreview = ({
  printRef,
  bodyRef,
  sites,
  siteSelectedId,
  demographicsInfos,
  uniqueId,
  mainBody,
}) => {
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
