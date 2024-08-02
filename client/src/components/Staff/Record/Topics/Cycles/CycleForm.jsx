import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import CycleCycleInfos from "./CycleCycleInfos";
import CycleEvents from "./CycleEvents";
import CycleNotes from "./CycleNotes";
import CyclePatientInfos from "./CyclePatientInfos";
import CycleSpermInfos from "./CycleSpermInfos";
import CycleTestsInfos from "./CycleTestsInfos";

const CycleForm = ({
  setAddVisible,
  patientId,
  demographicsInfos,
  topicPost,
}) => {
  const { user } = useUserContext();
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState({
    cycle_length: "",
    menstruation_length: "",
    etiology: "",
    amh: "",
    partner_sperm: true,
    donor_sperm_nbr: "",
    lmp: null,
    ohip_funded: false,
    cancelled: false,
    cycle_type: "",
    third_party: "",
    prewash_concentration: "",
    prewash_motility: "",
    postwash_motility: "",
    postwash_total_motile_sperm: "",
    test_blood_type_female: "",
    test_blood_type_male: "",
    test_hiv_female: "",
    test_hiv_male: "",
    test_hep_b_female: "",
    test_hep_b_male: "",
    test_hep_c_female: "",
    test_hep_c_male: "",
    test_syphilis_female: "",
    test_syphilis_male: "",
    test_cmv_female: "",
    test_sonohysterogram_female: "",
    test_endo_bx_female: "",
    patient_id: patientId,
    cycle_nbr: "",
    events: [],
    notes: [],
    cycle_notes: "",
    status: "Active",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await cycleSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    const cycleToPost = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      cycle_nbr: `${demographicsInfos.ChartNumber}-${formDatas.cycle_nbr}`,
    };

    setProgress(true);
    topicPost.mutate(cycleToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => setProgress(false),
    });
  };
  const handleClose = async (e) => {
    e.preventDefault();
    if (
      await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      })
    ) {
      setAddVisible(false);
    }
  };
  return (
    <form className="cycles-form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <CyclePatientInfos
        demographicsInfos={demographicsInfos}
        errMsg={errMsg}
      />
      <CycleSpermInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleCycleInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleTestsInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleEvents
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleNotes
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <div className="cycles-form__btn-container">
        <button className="save-btn" onClick={handleSubmit} disabled={progress}>
          Save
        </button>
        <button onClick={handleClose} disabled={progress}>
          Close
        </button>
        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default CycleForm;
