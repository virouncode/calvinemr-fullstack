
import {
    dateISOToTimestampTZ,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import CycleTypeList from "../../../../UI/Lists/CycleTypeList";
import EtiologyList from "../../../../UI/Lists/EtiologyList";
import ThirdPartyList from "../../../../UI/Lists/ThirdPartyList";

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
              <label htmlFor="cycle_nbr">Cycle#</label>
              <input
                type="text"
                value={formDatas.cycle_nbr}
                onChange={handleChange}
                id="cycle_nbr"
                name="cycle_nbr"
                autoComplete="off"
                style={{ width: "50px" }}
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="status">Status</label>
              <select
                value={formDatas.status}
                onChange={handleChange}
                id="status"
                name="status"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="cycle_length">Cycle length</label>
              <input
                type="text"
                value={formDatas.cycle_length}
                onChange={handleChange}
                id="cycle_length"
                name="cycle_length"
                autoComplete="off"
              />
            </div>
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="menstruation_length">Menstruation length</label>
              <input
                type="text"
                value={formDatas.menstruation_length}
                onChange={handleChange}
                id="menstruation_length"
                name="menstruation_length"
                autoComplete="off"
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
              <label htmlFor="amh">AMH (pmol/L)</label>
              <input
                type="text"
                value={formDatas.amh}
                name="amh"
                id="amh"
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="cycles-form__cycle-infos-row">
            <div className="cycles-form__cycle-infos-item">
              <label htmlFor="lmp">LMP</label>
              <input
                type="date"
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
