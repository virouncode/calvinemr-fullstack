import React from "react";
import { CycleType } from "../../../../../types/api";
import Input from "../../../../UI/Inputs/Input";

type CycleTestsInfosProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};

const CycleTestsInfos = ({
  formDatas,
  setFormDatas,
  setErrMsg,
  errMsg,
}: CycleTestsInfosProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  return (
    <fieldset
      className="cycles-form__tests-infos"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>TESTS</legend>
      <div className="cycles-form__tests-infos-content">
        <div className="cycles-form__tests-infos-row">
          <div
            className="cycles-form__tests-infos-sex"
            style={{ marginTop: "0", color: "#E3AFCD" }}
          >
            Female
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Blood type"
              name="test_blood_type_female"
              id="test_blood_type_female"
              value={formDatas.test_blood_type_female ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="HIV"
              name="test_hiv_female"
              id="test_hiv_female"
              onChange={handleChange}
              value={formDatas.test_hiv_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Hep B"
              name="test_hep_b_female"
              id="test_hep_b_female"
              onChange={handleChange}
              value={formDatas.test_hep_b_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Hep C"
              name="test_hep_c_female"
              id="test_hep_c_female"
              onChange={handleChange}
              value={formDatas.test_hep_c_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Syphilis"
              name="test_syphilis_female"
              id="test_syphilis_female"
              onChange={handleChange}
              value={formDatas.test_syphilis_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="CMV"
              name="test_cmv_female"
              id="test_cmv_female"
              onChange={handleChange}
              value={formDatas.test_cmv_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Sonohysterogram"
              name="test_sonohysterogram_female"
              id="test_sonohysterogram_female"
              onChange={handleChange}
              value={formDatas.test_sonohysterogram_female ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Endo bx"
              name="test_endo_bx_female"
              id="test_endo_bx_female"
              onChange={handleChange}
              value={formDatas.test_endo_bx_female ?? ""}
            />
          </div>
        </div>
        <div className="cycles-form__tests-infos-row">
          <div
            className="cycles-form__tests-infos-sex"
            style={{ color: "#6492D8" }}
          >
            Male (partner or donor)
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Blood type"
              name="test_blood_type_male"
              id="test_blood_type_male"
              onChange={handleChange}
              value={formDatas.test_blood_type_male ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="HIV"
              name="test_hiv_male"
              id="test_hiv_male"
              onChange={handleChange}
              value={formDatas.test_hiv_male ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Hep B"
              name="test_hep_b_male"
              id="test_hep_b_male"
              onChange={handleChange}
              value={formDatas.test_hep_b_male ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Hep C"
              name="test_hep_c_male"
              id="test_hep_c_male"
              onChange={handleChange}
              value={formDatas.test_hep_c_male ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="Syphilis"
              name="test_syphilis_male"
              id="test_syphilis_male"
              onChange={handleChange}
              value={formDatas.test_syphilis_male ?? ""}
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <Input
              label="CMV"
              name="test_cmv_male"
              id="test_cmv_male"
              onChange={handleChange}
              value={formDatas.test_cmv_male ?? ""}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CycleTestsInfos;
