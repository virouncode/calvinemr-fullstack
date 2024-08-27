import React from "react";
import { CycleType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type CyclePrintCycleProps = {
  cycle: CycleType;
};

const CyclePrintCycle = ({ cycle }: CyclePrintCycleProps) => {
  return (
    <div className="cycle-print__cycle">
      <div className="cycle-print__cycle-title">Cycle</div>
      <div className="cycle-print__cycle-content">
        <div className="cycle-print__cycle-item">
          <label>Cycle #: </label>
          <span>{cycle.cycle_nbr}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Status: </label>
          <span>{cycle.status}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Cycle length: </label>
          <span>{cycle.cycle_length}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Menstruation length: </label>
          <span>{cycle.menstruation_length}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Etiology: </label>
          <span>{cycle.etiology}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>AMH (pmol/L): </label>
          <span>{cycle.amh}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>LMP: </label>
          <span>{timestampToDateISOTZ(cycle.lmp)}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>OHIP Funded: </label>
          <span>{cycle.ohip_funded ? "Yes" : "No"}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Cancelled: </label>
          <span>{cycle.cancelled ? "Yes" : "No"}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Cycle type: </label>
          <span>{cycle.cycle_type}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Third party: </label>
          <span>{cycle.third_party}</span>
        </div>
        <div className="cycle-print__cycle-item">
          <label>Notes: </label>
          <span>{cycle.cycle_notes}</span>
        </div>
      </div>
    </div>
  );
};

export default CyclePrintCycle;
