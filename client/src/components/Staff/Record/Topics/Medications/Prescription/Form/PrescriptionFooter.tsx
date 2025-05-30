import React from "react";

type PrescriptionFooterProps = {
  uniqueId: string;
};
const PrescriptionFooter = ({ uniqueId }: PrescriptionFooterProps) => {
  return (
    <div className="prescription__footer">
      {uniqueId && <p className="prescription__id">ID: {uniqueId}</p>}
    </div>
  );
};

export default PrescriptionFooter;
