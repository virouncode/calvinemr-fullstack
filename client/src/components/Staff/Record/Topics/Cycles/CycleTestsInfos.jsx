

const CycleTestsInfos = ({ formDatas, setFormDatas, setErrMsg, errMsg }) => {
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
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
            <label htmlFor="test_blood_type_female">Blood type</label>
            <input
              type="text"
              name="test_blood_type_female"
              id="test_blood_type_female"
              value={formDatas.test_blood_type_female}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hiv_female">HIV</label>
            <input
              type="text"
              name="test_hiv_female"
              id="test_hiv_female"
              onChange={handleChange}
              value={formDatas.test_hiv_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hep_b_female">Hep B</label>
            <input
              type="text"
              name="test_hep_b_female"
              id="test_hep_b_female"
              onChange={handleChange}
              value={formDatas.test_hep_b_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hep_c_female">Hep C</label>
            <input
              type="text"
              name="test_hep_c_female"
              id="test_hep_c_female"
              onChange={handleChange}
              value={formDatas.test_hep_c_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_syphilis_female">Syphilis</label>
            <input
              type="text"
              name="test_syphilis_female"
              id="test_syphilis_female"
              onChange={handleChange}
              value={formDatas.test_syphilis_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_cmv_female">CMV</label>
            <input
              type="text"
              name="test_cmv_female"
              id="test_cmv_female"
              onChange={handleChange}
              value={formDatas.test_cmv_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_sonohysterogram_female">Sonohysterogram</label>
            <input
              type="text"
              name="test_sonohysterogram_female"
              id="test_sonohysterogram_female"
              onChange={handleChange}
              value={formDatas.test_sonohysterogram_female}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_endo_bx_female">Endo bx</label>
            <input
              type="text"
              name="test_endo_bx_female"
              id="test_endo_bx_female"
              onChange={handleChange}
              value={formDatas.test_endo_bx_female}
              autoComplete="off"
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
            <label htmlFor="test_blood_type_male">Blood type</label>
            <input
              type="text"
              name="test_blood_type_male"
              id="test_blood_type_male"
              onChange={handleChange}
              value={formDatas.test_blood_type_male}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hiv_male">HIV</label>
            <input
              type="text"
              name="test_hiv_male"
              id="test_hiv_male"
              onChange={handleChange}
              value={formDatas.test_hiv_male}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hep_b_male">Hep B</label>
            <input
              type="text"
              name="test_hep_b_male"
              id="test_hep_b_male"
              onChange={handleChange}
              value={formDatas.test_hep_b_male}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_hep_c_male">Hep C</label>
            <input
              type="text"
              name="test_hep_c_male"
              id="test_hep_c_male"
              onChange={handleChange}
              value={formDatas.test_hep_c_male}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_syphilis_male">Syphilis</label>
            <input
              type="text"
              name="test_syphilis_male"
              id="test_syphilis_male"
              onChange={handleChange}
              value={formDatas.test_syphilis_male}
              autoComplete="off"
            />
          </div>
          <div className="cycles-form__tests-infos-item cycles-form__tests-infos-item--tests">
            <label htmlFor="test_cmv_male">CMV</label>
            <input
              type="text"
              name="test_cmv_male"
              id="test_cmv_male"
              onChange={handleChange}
              value={formDatas.test_cmv_male}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CycleTestsInfos;
