import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
} from "../../../../../utils/measurements/measurements";
import { careElementsSchema } from "../../../../../validation/record/careElementsValidation";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CareElementHistory from "./CareElementHistory";
import CareElementsListAdd from "./CareElementsListAdd";
import CareElementsListContent from "./CareElementsListContent";

const CareElementsList = ({
  careElementPut,
  setPopUpVisible,
  datas,
  patientName,
}) => {
  const { user } = useUserContext();
  const [progress, setProgress] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [historyTopic, setHistoryTopic] = useState("");
  const [historyDatas, setHistoryDatas] = useState([]);
  const [historyUnit, setHistoryUnit] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);

  const handleAdd = () => {
    setAddVisible(true);
  };
  const handleClose = () => {
    setPopUpVisible(false);
  };
  const [addFormDatas, setAddFormDatas] = useState({
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
  const [addDate, setAddDate] = useState(nowTZTimestamp());

  const lastDatas = datas
    ? {
        SmokingStatus: datas.SmokingStatus?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { Status: "", Date: "" },
        SmokingPacks: datas.SmokingPacks?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { PerDay: "", Date: "" },
        Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Weight: "",
          WeightUnit: "kg",
          Date: "",
        },
        Height: datas.Height?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Height: "",
          HeightUnit: "cm",
          Date: "",
        },
        WaistCircumference: datas.WaistCircumference?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          WaistCircumference: "",
          WaistCircumferenceUnit: "cm",
          Date: "",
        },
        BloodPressure: datas.BloodPressure?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          SystolicBP: "",
          DiastolicBP: "",
          BPUnit: "mmHg",
          Date: "",
        },
        bodyMassIndex: datas.bodyMassIndex?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BMI: "", Date: "" },
        bodySurfaceArea: datas.bodySurfaceArea?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BSA: "", Date: "" },
      }
    : null;

  const handleClickHistory = (e, row) => {
    setHistoryTopic(row);
    let historyDatasToPass = [];
    let historyUnitToPass = "";

    switch (row) {
      case "SMOKING STATUS":
        historyDatasToPass = datas.SmokingStatus?.length
          ? datas.SmokingStatus.sort((a, b) => a.Date - b.Date)
          : [];
        break;
      case "SMOKING PACKS PER DAY":
        historyDatasToPass = datas.SmokingPacks?.length
          ? datas.SmokingPacks.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "packs";
        break;
      case "WEIGHT":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "kg";
        break;
      case "WEIGHT LBS":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "lbs";
        break;
      case "HEIGHT":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "HEIGHT FEET":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "feet";
        break;
      case "WAIST CIRCUMFERENCE":
        historyDatasToPass = datas.WaistCircumference?.length
          ? datas.WaistCircumference.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "BLOOD PRESSURE":
        historyDatasToPass = datas.BloodPressure?.length
          ? datas.BloodPressure.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "mmHg";
        break;
      case "BODY MASS INDEX":
        historyDatasToPass = datas.bodyMassIndex?.length
          ? datas.bodyMassIndex.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "kg/m2";
        break;
      case "BODY SURFACE AREA":
        historyDatasToPass = datas.bodySurfaceArea?.length
          ? datas.bodySurfaceArea.sort((a, b) => a.Date - b.Date)
          : [];
        historyUnitToPass = "m2";
        break;
      default:
        break;
    }
    setHistoryDatas(historyDatasToPass);
    setHistoryVisible(true);
    setHistoryUnit(historyUnitToPass);
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Validation
    try {
      await careElementsSchema.validate(addFormDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (
      (addFormDatas.SmokingStatus.Status === "Y" ||
        addFormDatas.SmokingStatus.Status === "N") &&
      !addFormDatas.SmokingPacks.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required (type 0 if no smoking)");
      return;
    }
    if (
      addFormDatas.BloodPressure.SystolicBP &&
      !addFormDatas.BloodPressure.DiastolicBP
    ) {
      setErrMsgPost("Diastolic field is required if you enter Systolic");
      return;
    }
    if (
      addFormDatas.BloodPressure.DiastolicBP &&
      !addFormDatas.BloodPressure.SystolicBP
    ) {
      setErrMsgPost("Systolic field is required if you enter Diastolic");
      return;
    }

    const careElementToPut = {
      ...datas,
      SmokingStatus: addFormDatas.SmokingStatus?.Status
        ? [...datas.SmokingStatus, addFormDatas.SmokingStatus]
        : [...datas.SmokingStatus],
      SmokingPacks: addFormDatas.SmokingPacks?.PerDay
        ? [...datas.SmokingPacks, addFormDatas.SmokingPacks]
        : [...datas.SmokingPacks],
      Weight: addFormDatas.Weight?.Weight
        ? [...datas.Weight, addFormDatas.Weight]
        : [...datas.Weight],
      Height: addFormDatas.Height?.Height
        ? [...datas.Height, addFormDatas.Height]
        : [...datas.Height],
      WaistCircumference: addFormDatas.WaistCircumference?.WaistCircumference
        ? [...datas.WaistCircumference, addFormDatas.WaistCircumference]
        : [...datas.WaistCircumference],
      BloodPressure:
        addFormDatas.BloodPressure?.SystolicBP &&
        addFormDatas.BloodPressure?.DiastolicBP
          ? [...datas.BloodPressure, addFormDatas.BloodPressure]
          : [...datas.BloodPressure],
      bodyMassIndex: addFormDatas.bodyMassIndex?.BMI
        ? [...datas.bodyMassIndex, addFormDatas.bodyMassIndex]
        : addFormDatas.Weight?.Weight
        ? [
            ...datas.bodyMassIndex,
            {
              BMI: bodyMassIndex(
                datas.Height?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1).Height,
                addFormDatas.Weight?.Weight
              ),
              Date: addDate,
            },
          ]
        : addFormDatas.Height?.Height
        ? [
            ...datas.bodyMassIndex,
            {
              BMI: bodyMassIndex(
                addFormDatas.Height?.Height,
                datas.Weight?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1).Weight
              ),
              Date: addDate,
            },
          ]
        : [...datas.bodyMassIndex],
      bodySurfaceArea: addFormDatas.bodySurfaceArea?.BSA
        ? [...datas.bodySurfaceArea, addFormDatas.bodySurfaceArea]
        : addFormDatas.Weight?.Weight
        ? [
            ...datas.bodySurfaceArea,
            {
              BSA: bodySurfaceArea(
                datas.Height?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1).Height,
                addFormDatas.Weight?.Weight
              ),
              Date: addDate,
            },
          ]
        : addFormDatas.Height?.Height
        ? [
            ...datas.bodySurfaceArea,
            {
              BSA: bodySurfaceArea(
                addFormDatas.Height?.Height,
                datas.Weight?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1).Weight
              ),
              Date: addDate,
            },
          ]
        : [...datas.bodySurfaceArea],
      updates: [
        ...datas.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    //Submission
    setProgress(true);
    careElementPut.mutate(careElementToPut, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
        setAddFormDatas({
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
      },
      onError: () => {
        setProgress(false);
      },
    });
    setAddVisible(false);
  };

  const handleCancel = () => {
    setAddVisible(false);
    setErrMsgPost("");
  };

  return (
    <>
      <h1 className="care-elements__title">Patient care elements</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div
        className="care-elements__card"
        style={{ border: errMsgPost && "solid 1.5px red" }}
      >
        <div className="care-elements__card-title">
          <span>
            {addVisible ? "Add new care elements" : "Last information"}
          </span>
          <div className="care-elements__btn-container">
            {!addVisible ? (
              <>
                <Button onClick={handleAdd} disabled={progress} label="Add" />
                <CloseButton onClick={handleClose} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </div>
        <div className="care-elements__card-content">
          {addVisible && (
            <CareElementsListAdd
              careElementPut={careElementPut}
              addFormDatas={addFormDatas}
              setAddFormDatas={setAddFormDatas}
              setErrMsgPost={setErrMsgPost}
              addDate={addDate}
              setAddDate={setAddDate}
              datas={datas}
            />
          )}
          {!addVisible && (
            <CareElementsListContent
              careElementPut={careElementPut}
              datas={datas}
              lastDatas={lastDatas}
              handleClickHistory={handleClickHistory}
            />
          )}
        </div>
      </div>
      {historyVisible && (
        <FakeWindow
          title={`${historyTopic} HISTORY of ${patientName}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#577399"
          setPopUpVisible={setHistoryVisible}
        >
          <CareElementHistory
            historyTopic={historyTopic}
            historyDatas={historyDatas}
            historyUnit={historyUnit}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default CareElementsList;
