import React from "react";
import Edocs from "./Edocs";
import Pamphlets from "./Pamphlets";
import ReferenceLinks from "./ReferenceLinks";

const Reference = () => {
  return (
    <>
      <ReferenceLinks />
      <Edocs />
      <Pamphlets />
    </>
  );
};

export default Reference;
