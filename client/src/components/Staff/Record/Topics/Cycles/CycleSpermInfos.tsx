import React from "react";
import { CycleType } from "../../../../../types/api";
import Input from "../../../../UI/Inputs/Input";
import Radio from "../../../../UI/Radio/Radio";

type CycleSpermInfosProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};

const CycleSpermInfos = ({
  formDatas,
  setFormDatas,
  setErrMsg,
  errMsg,
}: CycleSpermInfosProps) => {
  const handleChangeSperm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;

    if (value === "partner_sperm") {
      setFormDatas({ ...formDatas, partner_sperm: true, donor_sperm_nbr: "" });
    } else {
      setFormDatas({ ...formDatas, partner_sperm: false });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };
  return (
    <fieldset
      className="cycles-form__sperm-infos"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>SPERM</legend>
      <div className="cycles-form__sperm-infos-content">
        <div
          className="cycles-form__sperm-infos-row"
          style={{ marginTop: "0", marginBottom: "20px" }}
        >
          <div className="cycles-form__sperm-infos-radio-item">
            <Radio
              checked={formDatas.partner_sperm as boolean}
              onChange={handleChangeSperm}
              value="partner_sperm"
              name="sperm-type"
              id="partner_sperm"
              label="Partner sperm"
            />
          </div>
          <div className="cycles-form__sperm-infos-radio-item">
            <Radio
              checked={!formDatas.partner_sperm as boolean}
              onChange={handleChangeSperm}
              value="donor_sperm"
              name="sperm-type"
              id="donor_sperm"
              label="Donor sperm"
            />
          </div>
          {!formDatas.partner_sperm && (
            <Input
              name="donor_sperm_nbr"
              placeholder="Donor sperm number..."
              value={formDatas.donor_sperm_nbr ?? ""}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="cycles-form__sperm-infos-row">
          <div className="cycles-form__sperm-infos-row-subtitle">Pre wash</div>
          <div className="cycles-form__sperm-infos-item">
            <Input
              label="Concentration"
              id="prewash_concentration"
              name="prewash_concentration"
              value={formDatas.prewash_concentration ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="cycles-form__sperm-infos-item">
            <Input
              label="Motility"
              id="prewash_motility"
              name="prewash_motility"
              value={formDatas.prewash_motility ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="cycles-form__sperm-infos-row-subtitle">Post wash</div>
          <div className="cycles-form__sperm-infos-item">
            <Input
              label="Motility"
              id="postwash_motility"
              name="postwash_motility"
              value={formDatas.postwash_motility ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="cycles-form__sperm-infos-item">
            <Input
              label="Total Motile Sperm"
              id="postwash_total_motile_sperm"
              name="postwash_total_motile_sperm"
              value={formDatas.postwash_total_motile_sperm ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CycleSpermInfos;
