import React from "react";
import { CycleType } from "../../../../../types/api";

type CyclePrintTestsProps = {
  cycle: CycleType;
  gender: "Female" | "Male";
};

const CyclePrintTests = ({ cycle, gender }: CyclePrintTestsProps) => {
  return (
    <div className="cycle-print__tests">
      <div className="cycle-print__tests-title">{gender} Tests</div>
      <div className="cycle-print__tests-content">
        <div className="cycle-print__tests-item">
          <label>Blood type: </label>
          <span>
            {gender === "Female"
              ? cycle.test_blood_type_female
              : cycle.test_blood_type_male}
          </span>
        </div>
        <div className="cycle-print__tests-item">
          <label>HIV: </label>
          <span>
            {gender === "Female" ? cycle.test_hiv_female : cycle.test_hiv_male}
          </span>
        </div>
        <div className="cycle-print__tests-item">
          <label>Hep B: </label>
          <span>
            {gender === "Female"
              ? cycle.test_hep_b_female
              : cycle.test_hep_b_male}
          </span>
        </div>
        <div className="cycle-print__tests-item">
          <label>Hep C: </label>
          <span>
            {gender === "Female"
              ? cycle.test_hep_c_female
              : cycle.test_hep_c_male}
          </span>
        </div>
        <div className="cycle-print__tests-item">
          <label>Syphilis: </label>
          <span>
            {gender === "Female"
              ? cycle.test_syphilis_female
              : cycle.test_syphilis_male}
          </span>
        </div>
        <div className="cycle-print__tests-item">
          <label>CMV: </label>
          <span>
            {gender === "Female" ? cycle.test_cmv_female : cycle.test_cmv_male}
          </span>
        </div>
        {gender === "Female" && (
          <>
            <div className="cycle-print__tests-item">
              <label>Sonohysterogram: </label>
              <span>{cycle.test_sonohysterogram_female}</span>
            </div>
            <div className="cycle-print__tests-item">
              <label>Endo bx: </label>
              <span>{cycle.test_endo_bx_female}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CyclePrintTests;
