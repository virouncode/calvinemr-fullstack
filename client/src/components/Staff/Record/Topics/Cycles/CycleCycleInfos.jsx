import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import CycleTypeList from "../../../../UI/Lists/CycleTypeList";
import EtiologyList from "../../../../UI/Lists/EtiologyList";
import ThirdPartyList from "../../../../UI/Lists/ThirdPartyList";
import CycleStatusSelect from "./CycleStatusSelect";

const CycleCycleInfos = ({ formDatas, setFormDatas, errMsg, setErrMsg }) => {
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "lmp")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleEtiologyChange = (value) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, etiology: value });
  };
  const handleCycleTypeChange = (value) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, cycle_type: value });
  };
  const handleThirdPartyChange = (value) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, third_party: value });
  };
  const handleChangeCheckbox = (e) => {
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
        <div
          className="cycles-form__cycle-infos-content"
          style={{ width: "83%" }}
        >
          <div
            className="cycles-form__cycle-infos-row"
            style={{ marginTop: "0" }}
          >
            <div
              className="cycles-form__cycle-infos-item"
              style={{ marginRight: "28px" }}
            >
              <Input
                value={formDatas.cycle_nbr}
                onChange={handleChange}
                name="cycle_nbr"
                id="cycle_nbr"
                label="Cycle#"
                width={50}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <CycleStatusSelect
                value={formDatas.status}
                handleChange={handleChange}
                label="Status"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="Cycle length"
                value={formDatas.cycle_length}
                onChange={handleChange}
                id="cycle_length"
                name="cycle_length"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="Menstruation length"
                value={formDatas.menstruation_length}
                onChange={handleChange}
                id="menstruation_length"
                name="menstruation_length"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="etiology">Etiology</label>
              <EtiologyList
                value={formDatas.etiology}
                handleChange={handleEtiologyChange}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <Input
                label="AMH (pmol/L)"
                value={formDatas.amh}
                name="amh"
                id="amh"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="cycles-form__cycle-infos-row">
            <div className="cycles-form__cycle-infos-item">
              <InputDate
                lavel="LMP"
                value={timestampToDateISOTZ(formDatas.lmp)}
                name="lmp"
                id="lmp"
                onChange={handleChange}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label>OHIP funded</label>
              <input
                type="checkbox"
                checked={formDatas.ohip_funded}
                style={{ textAlign: "start", height: "15px" }}
                name="ohip_funded"
                onChange={handleChangeCheckbox}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label>Cancelled</label>
              <input
                type="checkbox"
                checked={formDatas.cancelled}
                name="cancelled"
                style={{ textAlign: "start", height: "15px" }}
                onChange={handleChangeCheckbox}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label>Cycle type</label>
              <CycleTypeList
                value={formDatas.cycle_type}
                handleChange={handleCycleTypeChange}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label>3rd party</label>
              <ThirdPartyList
                value={formDatas.third_party}
                handleChange={handleThirdPartyChange}
              />
            </div>
          </div>
        </div>
        <div className="cycles-form__cycle-infos-item" style={{ width: "17%" }}>
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
