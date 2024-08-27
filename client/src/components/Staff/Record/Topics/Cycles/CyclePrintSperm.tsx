import React from "react";
import { CycleType } from "../../../../../types/api";

type CyclePrintSpermProps = {
  cycle: CycleType;
};

const CyclePrintSperm = ({ cycle }: CyclePrintSpermProps) => {
  return (
    <div className="cycle-print__sperm">
      <div className="cycle-print__sperm-title">Sperm</div>
      <div className="cycle-print__sperm-content">
        <div className="cycle-print__sperm-item">
          {cycle.partner_sperm ? (
            <label>Partner sperm</label>
          ) : (
            <>
              <label>Donor sperm #: </label>
              <span>{cycle.donor_sperm_nbr}</span>
            </>
          )}
        </div>
        <div className="cycle-print__sperm-item">
          <label>Pre-wash concentration: </label>
          <span>{cycle.prewash_concentration}</span>
        </div>
        <div className="cycle-print__sperm-item">
          <label>Pre-wash motility: </label>
          <span>{cycle.prewash_motility}</span>
        </div>
        <div className="cycle-print__sperm-item">
          <label>Post-wash motility: </label>
          <span>{cycle.postwash_motility}</span>
        </div>
        <div className="cycle-print__sperm-item">
          <label>Post-wash total motile sperm: </label>
          <span>{cycle.postwash_total_motile_sperm}</span>
        </div>
      </div>
    </div>
  );
};

export default CyclePrintSperm;
