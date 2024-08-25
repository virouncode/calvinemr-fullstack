import React from "react";
import Edocs from "./Edocs";
import Pamphlets from "./Pamphlets";
import ReferenceLinks from "./ReferenceLinks";

const Reference = () => {
  return (
    <div className="reference">
      <ReferenceLinks />
      <Edocs />
      <Pamphlets />
    </div>
  );
};

export default Reference;
