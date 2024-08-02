import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ynIndicatorsimpleCT } from "../../../../../omdDatas/codesTables";
import {
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
    bodyMassIndex,
    bodySurfaceArea,
    cmToFeet,
    feetToCm,
    kgToLbs,
    lbsToKg,
} from "../../../../../utils/measurements/measurements";
import { careElementsSchema } from "../../../../../validation/record/careElementsValidation";
import GenericList from "../../../../UI/Lists/GenericList";

const CareElementsForm = ({ careElementPost, setPopUpVisible, patientId }) => {
  const { user } = useUserContext();
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState({
    patient_id: parseInt(patientId),
    SmokingStatus: { Status: "", Date: "" },
    SmokingPacks: { PerDay: "", Date: "" },
    Weight: { Weight: "", WeightUnit: "kg", Date: "" },
    WeightLbs: { Weight: "", WeightUnit: "lbs", Date: "" },
    Height: { Height: "", HeightUnit: "cm", Date: "" },
    HeightFeet: { Height: "", HeightUnit: "feet", Date: "" },
    WaistCircumference: {
      WaistCircumference: "",
      WaistCircumferenceUnit: "cm",
      Date: "",
    },
    BloodPressure: {
      SystolicBP: "",
      DiastolicBP: "",
      BPUnit: "mmHg",
      Date: "",
    },
    bodyMassIndex: { BMI: "", Date: "" },
    bodySurfaceArea: { BSA: "", Date: "" },
  });
  const [progress, setProgress] = useState(false);
  const [date, setDate] = useState(timestampToDateISOTZ(nowTZTimestamp()));

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    switch (name) {
      case "SmokingStatus":
        setFormDatas({
          ...formDatas,
          SmokingStatus: {
            ...formDatas.SmokingStatus,
            Status: value,
            Date: date,
          },
          SmokingPacks:
            value === "N"
              ? {
                  ...formDatas.SmokingPacks,
                  PerDay: "0",
                  Date: date,
                }
              : {
                  ...formDatas.SmokingPacks,
                  PerDay: "",
                  Date: date,
                },
        });
        break;
      case "SmokingPacks":
        setFormDatas({
          ...formDatas,
          SmokingPacks: {
            ...formDatas.SmokingPacks,
            PerDay: value,
            Date: date,
          },
          SmokingStatus: {
            ...formDatas.SmokingStatus,
            Status: Number(value) ? "Y" : "N",
            Date: date,
          },
        });
        break;
      case "Weight":
        setFormDatas({
          ...formDatas,
          Weight: { ...formDatas.Weight, Weight: value, Date: date },
          WeightLbs: {
            ...formDatas.WeightLbs,
            Weight: kgToLbs(value),
            Date: date,
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(formDatas.Height?.Height, value),
            Date: date,
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(formDatas.Height?.Height, value),
            Date: date,
          },
        });
        break;
      case "WeightLbs":
        setFormDatas({
          ...formDatas,
          WeightLbs: {
            ...formDatas.WeightLbs,
            Weight: value,
            Date: date,
          },
          Weight: {
            ...formDatas.Weight,
            Weight: lbsToKg(value),
            Date: date,
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(formDatas.Height?.Height, lbsToKg(value)),
            Date: date,
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(formDatas.Height?.Height, lbsToKg(value)),
            Date: date,
          },
        });
        break;
      case "Height":
        setFormDatas({
          ...formDatas,
          Height: { ...formDatas.Height, Height: value, Date: date },
          HeightFeet: {
            ...formDatas.HeightFeet,
            Height: cmToFeet(value),
            Date: date,
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(value, formDatas.Weight?.Weight),
            Date: date,
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(value, formDatas.Weight?.Weight),
            Date: date,
          },
        });
        break;
      case "HeightFeet":
        setFormDatas({
          ...formDatas,
          HeightFeet: { ...formDatas.HeightFeet, Height: value, Date: date },
          Height: {
            ...formDatas.Height,
            Height: feetToCm(value),
            Date: date,
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(feetToCm(value), formDatas.Weight?.Weight),
            Date: date,
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(feetToCm(value), formDatas.Weight?.Weight),
            Date: date,
          },
        });
        break;
      case "Waist":
        setFormDatas({
          ...formDatas,
          WaistCircumference: {
            ...formDatas.WaistCircumference,
            WaistCircumference: value,
            Date: date,
          },
        });
        break;
      case "SystolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...formDatas.BloodPressure,
            SystolicBP: value,
            Date: date,
          },
        });
        break;
      case "DiastolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...formDatas.BloodPressure,
            DiastolicBP: value,
            Date: date,
          },
        });
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await careElementsSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (
      (formDatas.SmokingStatus.Status === "Y" ||
        formDatas.SmokingStatus.Status === "N") &&
      !formDatas.SmokingPacks.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required (type 0 if no smoking)");
      return;
    }
    if (
      formDatas.BloodPressure.SystolicBP &&
      !formDatas.BloodPressure.DiastolicBP
    ) {
      setErrMsgPost("Diastolic field is required if you enter Systolic");
      return;
    }
    if (
      formDatas.BloodPressure.DiastolicBP &&
      !formDatas.BloodPressure.SystolicBP
    ) {
      setErrMsgPost("Systolic field is required if you enter Diastolic");
      return;
    }
    //Submission
    const careElementToPost = {
      patient_id: patientId,
      SmokingStatus: formDatas.SmokingStatus.Status
        ? [formDatas.SmokingStatus]
        : [],
      SmokingPacks: formDatas.SmokingPacks.PerDay
        ? [formDatas.SmokingPacks]
        : [],
      Weight: formDatas.Weight.Weight ? [formDatas.Weight] : [],
      Height: formDatas.Height.Height ? [formDatas.Height] : [],
      WaistCircumference: formDatas.WaistCircumference.WaistCircumference
        ? [formDatas.WaistCircumference]
        : [],
      BloodPressure: formDatas.BloodPressure.Date
        ? [formDatas.BloodPressure]
        : [],
      bodyMassIndex: formDatas.bodyMassIndex.BMI
        ? [formDatas.bodyMassIndex]
        : [],
      bodySurfaceArea: formDatas.bodySurfaceArea.BSA
        ? [formDatas.bodySurfaceArea]
        : [],
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    setProgress(true);
    careElementPost.mutate(careElementToPost, {
      onSuccess: () => {
        setProgress(false);
        setPopUpVisible(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setErrMsgPost("");
    setPopUpVisible(false);
  };
  const handleDateChange = (e) => {
    const value = e.target.value;
    setErrMsgPost("");
    setDate(value);
  };
  return (
    <>
      <h1 className="care-elements__title">
        Patient care elements <i className="fa-solid fa-ruler-combined"></i>
      </h1>
      {errMsgPost && <div className="care-elements__err">{errMsgPost}</div>}
      <div
        className="care-elements__card"
        style={{ border: errMsgPost && "solid 1.5px red" }}
      >
        <div className="care-elements__card-title">
          <span>Add new care elements</span>
          <div className="care-elements__btn-container">
            <button
              onClick={handleSubmit}
              disabled={progress}
              className="save-btn"
            >
              Save
            </button>
            <button type="button" onClick={handleCancel} disabled={progress}>
              Cancel
            </button>
          </div>
        </div>
        <div className="care-elements__card-content">
          <div className="care-elements__row">
            <label className="care-elements__row-label">Date:</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input type="date" onChange={handleDateChange} value={date} />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Smoking:</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <GenericList
                list={ynIndicatorsimpleCT}
                name="SmokingStatus"
                handleChange={handleChange}
                value={formDatas.SmokingStatus?.Status}
                noneOption={false}
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">
              Smoking Packs (per day):
            </label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="SmokingPacks"
                onChange={handleChange}
                value={formDatas.SmokingPacks?.PerDay}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Weight (kg):</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="Weight"
                onChange={handleChange}
                value={formDatas.Weight?.Weight}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Weight (lbs):</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="WeightLbs"
                onChange={handleChange}
                value={formDatas.WeightLbs?.Weight}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Height (cm):</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="Height"
                onChange={handleChange}
                value={formDatas.Height?.Height}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Height (feet):</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="HeightFeet"
                onChange={handleChange}
                value={formDatas.HeightFeet?.Height}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">
              Body mass index (kg/m2):
            </label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="BMI"
                value={formDatas.bodyMassIndex?.BMI}
                autoComplete="off"
                readOnly
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">
              Body surface area (m2):
            </label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="BSA"
                value={formDatas.bodySurfaceArea?.BSA}
                autoComplete="off"
                readOnly
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">
              Waist circumference (cm):
            </label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="Waist"
                onChange={handleChange}
                value={formDatas.WaistCircumference?.WaistCircumference}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">Systolic (mmHg):</label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="SystolicBP"
                onChange={handleChange}
                value={formDatas.BloodPressure?.SystolicBP}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="care-elements__row">
            <label className="care-elements__row-label">
              Diastolic (mmHg):
            </label>
            <div className="care-elements__row-value care-elements__row-value--add">
              <input
                type="text"
                name="DiastolicBP"
                onChange={handleChange}
                value={formDatas.BloodPressure?.DiastolicBP}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareElementsForm;
