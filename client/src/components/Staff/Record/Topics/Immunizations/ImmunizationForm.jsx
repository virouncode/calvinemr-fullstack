import { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import GenericComboImmunization from "./ImmunizationCombo";

const ImmunizationForm = ({
  patientId,
  setAddVisible,
  errMsgPost,
  setErrMsgPost,
  editCounter,
  topicPost,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    ImmunizationType: "",
    ImmunizationName: "",
    Manufacturer: "",
    LotNumber: "",
    Route: "",
    Site: "",
    Dose: "",
    Instructions: "",
    Notes: "",
    recommended: false,
    Date: nowTZTimestamp(),
    RefusedFlag: { ynIndicatorsimple: "N" },
  });
  const [progress, setProgress] = useState(false);

  const handleRouteChange = (value) => {
    setFormDatas({ ...formDatas, Route: value });
  };
  const handleSiteChange = (value) => {
    setFormDatas({ ...formDatas, Site: value });
  };
  const handleImmunizationChange = (value) => {
    setFormDatas({ ...formDatas, ImmunizationType: value });
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await immunizationSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "RefusedFlag") {
      setFormDatas({ ...formDatas, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr className="immunizations__form">
      <td
        style={{ textAlign: "center", border: errMsgPost && "solid 1.5px red" }}
      >
        <div className="immunizations__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td className="immunizations__form-type-list">
        <GenericComboImmunization
          list={immunizationTypeCT}
          value={formDatas.ImmunizationType}
          handleChange={handleImmunizationChange}
        />
      </td>
      <td>
        <input
          name="ImmunizationName"
          type="text"
          value={formDatas.ImmunizationName}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Manufacturer"
          type="text"
          value={formDatas.Manufacturer}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="LotNumber"
          type="text"
          value={formDatas.LotNumber}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
        />
      </td>
      <td>
        <GenericCombo
          list={siteCT}
          value={formDatas.Site}
          handleChange={handleSiteChange}
        />
      </td>
      <td>
        <input
          name="Dose"
          type="text"
          value={formDatas.Dose}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Date"
          type="date"
          value={timestampToDateISOTZ(formDatas.Date)}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          value={formDatas.RefusedFlag.ynIndicatorsimple}
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="Instructions"
          type="text"
          value={formDatas.Instructions}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Notes"
          type="text"
          value={formDatas.Notes}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>{staffIdToTitleAndName(staffInfos, user.id)}</td>
      <td>{timestampToDateISOTZ(nowTZTimestamp())}</td>
    </tr>
  );
};

export default ImmunizationForm;
