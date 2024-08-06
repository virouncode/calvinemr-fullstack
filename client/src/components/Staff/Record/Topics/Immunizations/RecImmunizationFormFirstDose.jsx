import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import FormRecImmunization from "./FormRecImmunization";

const RecImmunizationFormFirstDose = ({
  setFormVisible,
  type,
  age,
  rangeEnd,
  route,
  patientId,
  errMsgPost,
  setErrMsgPost,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    ImmunizationName: "",
    ImmunizationType: type,
    Manufacturer: "",
    LotNumber: "",
    Route: route,
    Site: "",
    Dose: "",
    Date: rangeEnd,
    RefusedFlag: { ynIndicatorsimple: "N" },
    Instructions: "",
    Notes: "",
    age: age,
    doseNumber: 1,
    patient_id: patientId,
    recommended: true,
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      patient_id: patientId,
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
        setFormVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value },
      });
      return;
    }
    if (name === "Date") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: value,
    });
  };
  const handleSiteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Site: value,
    });
  };

  return (
    <FormRecImmunization
      formDatas={formDatas}
      errMsgPost={errMsgPost}
      type={type}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleRouteChange={handleRouteChange}
      handleSiteChange={handleSiteChange}
      handleCancel={handleCancel}
      progress={progress}
    />
  );
};

export default RecImmunizationFormFirstDose;
