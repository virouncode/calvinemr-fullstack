import Pamphlets from "./Pamphlets";
import ReferenceEdocs from "./ReferenceEdocs";
import ReferenceLinks from "./ReferenceLinks";

const Reference = () => {
  return (
    <div className="reference">
      <ReferenceLinks />
      <ReferenceEdocs />
      <Pamphlets />
    </div>
  );
};

export default Reference;
