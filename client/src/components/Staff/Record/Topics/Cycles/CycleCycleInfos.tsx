import React from "react";
import { CycleType } from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import CycleTypeList from "../../../../UI/Lists/CycleTypeList";
import EtiologyList from "../../../../UI/Lists/EtiologyList";
import ThirdPartyList from "../../../../UI/Lists/ThirdPartyList";
import CycleStatusSelect from "./CycleStatusSelect";

type CycleCycleInfosProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};

const CycleCycleInfos = ({
  formDatas,
  setFormDatas,
  errMsg,
  setErrMsg,
}: CycleCycleInfosProps) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setErrMsg("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "lmp")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleEtiologyChange = (value: string) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, etiology: value });
  };
  const handleCycleTypeChange = (value: string) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, cycle_type: value });
  };
  const handleThirdPartyChange = (value: string) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, third_party: value });
  };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const checked = e.target.checked;
    const name = e.target.name;
    if (checked) {
      setFormDatas({ ...formDatas, [name]: true });
    } else {
      setFormDatas({ ...formDatas, [name]: false });
    }
  };
  return (
    <fieldset
      className="cycles-form__cycle-infos"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>CYCLE</legend>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="cycles-form__cycle-infos-content">
          <div
            className="cycles-form__cycle-infos-row"
            style={{ marginTop: "0" }}
          >
            <div
              className="cycles-form__cycle-infos-item"
              style={{ marginRight: "28px" }}
            >
              <Input
                value={formDatas.cycle_nbr ?? ""}
                onChange={handleChange}
                name="cycle_nbr"
                id="cycle_nbr"
                label="Cycle#"
                width={50}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <CycleStatusSelect
                value={formDatas.status ?? ""}
                onChange={handleChange}
                label="Status"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="Cycle length"
                value={formDatas.cycle_length ?? ""}
                onChange={handleChange}
                id="cycle_length"
                name="cycle_length"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="Menstruation length"
                value={formDatas.menstruation_length ?? ""}
                onChange={handleChange}
                id="menstruation_length"
                name="menstruation_length"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="etiology">Etiology</label>
              <EtiologyList
                value={formDatas.etiology ?? ""}
                handleChange={handleEtiologyChange}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="AMH (pmol/L)"
                value={formDatas.amh ?? ""}
                name="amh"
                id="amh"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="cycles-form__cycle-infos-row">
            <div className="cycles-form__cycle-infos-item">
              <InputDate
                label="LMP"
                value={timestampToDateISOTZ(formDatas.lmp)}
                name="lmp"
                id="lmp"
                onChange={handleChange}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Checkbox
                label="OHIP funded"
                labelSide="left"
                checked={formDatas.ohip_funded as boolean}
                name="ohip_funded"
                onChange={handleCheck}
                mr={0}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Checkbox
                label="Cancelled"
                labelSide="left"
                checked={formDatas.cancelled as boolean}
                name="cancelled"
                onChange={handleCheck}
                mr={0}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <CycleTypeList
                value={formDatas.cycle_type ?? ""}
                handleChange={handleCycleTypeChange}
                label="Cycle type"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <ThirdPartyList
                value={formDatas.third_party ?? ""}
                handleChange={handleThirdPartyChange}
                label="3rd party"
              />
            </div>
          </div>
        </div>
        <div className="cycles-form__cycle-infos-item" style={{ flex: "1" }}>
          <label htmlFor="cycle_notes">Notes</label>
          <textarea
            value={formDatas.cycle_notes}
            name="cycle_notes"
            id="cycle_notes"
            onChange={handleChange}
            autoComplete="off"
            rows={5}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default CycleCycleInfos;
