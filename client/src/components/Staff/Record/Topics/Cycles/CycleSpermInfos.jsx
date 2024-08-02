

const CycleSpermInfos = ({ formDatas, setFormDatas, setErrMsg, errMsg }) => {
  const handleChangeSperm = (e) => {
    setErrMsg("");
    const name = e.target.name;
    if (name === "partner_sperm") {
      setFormDatas({ ...formDatas, partner_sperm: true, donor_sperm_nbr: "" });
    } else {
      setFormDatas({ ...formDatas, partner_sperm: false });
    }
  };
  const handleChange = (e) => {
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
            <input
              type="radio"
              checked={formDatas.partner_sperm}
              onChange={handleChangeSperm}
              name="partner_sperm"
              id="partner_sperm"
            />
            <label htmlFor="partner_sperm">Partner sperm</label>
          </div>
          <div className="cycles-form__sperm-infos-radio-item">
            <input
              type="radio"
              checked={!formDatas.partner_sperm}
              onChange={handleChangeSperm}
              name="donor_sperm"
              id="donor_sperm"
            />
            <label htmlFor="donor_sperm">Donor sperm</label>
          </div>
          {!formDatas.partner_sperm && (
            <input
              type="text"
              name="donor_sperm_nbr"
              placeholder="Donor sperm number..."
              value={formDatas.donor_sperm_nbr}
              onChange={handleChange}
              autoComplete="off"
            />
          )}
        </div>
        <div className="cycles-form__sperm-infos-row">
          <div className="cycles-form__sperm-infos-row-subtitle">Pre wash</div>
          <div className="cycles-form__sperm-infos-item">
            <label htmlFor="prewash_concentration">Concentration</label>
            <input
              type="text"
              id="prewash_concentration"
              name="prewash_concentration"
              value={formDatas.prewash_concentration}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__sperm-infos-item">
            <label htmlFor="prewash_motility">Motility</label>
            <input
              type="text"
              id="prewash_motility"
              name="prewash_motility"
              value={formDatas.prewash_motility}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__sperm-infos-row-subtitle">Post wash</div>
          <div className="cycles-form__sperm-infos-item">
            <label>Motility</label>
            <input
              type="text"
              id="postwash_motility"
              name="postwash_motility"
              value={formDatas.postwash_motility}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__sperm-infos-item">
            <label>Total Motile Sperm</label>
            <input
              type="text"
              id="postwah_total_motile_sperm"
              name="postwah_total_motile_sperm"
              value={formDatas.postwah_total_motile_sperm}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CycleSpermInfos;
