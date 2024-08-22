import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  CareElementFormType,
  CareElementHistoryTopicType,
  CareElementLastDatasType,
  CareElementType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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

type CareElementsListProps = {
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  datas: CareElementType;
  patientName: string;
};

const CareElementsList = ({
  careElementPut,
  setPopUpVisible,
  datas,
  patientName,
}: CareElementsListProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [historyTopic, setHistoryTopic] =
    useState<CareElementHistoryTopicType>("SMOKING STATUS");
  const [historyDatas, setHistoryDatas] = useState<unknown[]>([]);
  const [historyUnit, setHistoryUnit] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);

  const handleAdd = () => {
    setAddVisible(true);
  };
  const handleClose = () => {
    setPopUpVisible(false);
  };
  const [addFormDatas, setAddFormDatas] = useState<
    Partial<CareElementFormType>
  >({
    SmokingStatus: { Status: "", Date: nowTZTimestamp() },
    SmokingPacks: { PerDay: "", Date: nowTZTimestamp() },
    Weight: { Weight: "", WeightUnit: "kg", Date: nowTZTimestamp() },
    WeightLbs: { Weight: "", WeightUnit: "lbs", Date: nowTZTimestamp() },
    Height: { Height: "", HeightUnit: "cm", Date: nowTZTimestamp() },
    HeightFeet: { Height: "", HeightUnit: "feet", Date: nowTZTimestamp() },
    WaistCircumference: {
      WaistCircumference: "",
      WaistCircumferenceUnit: "cm",
      Date: nowTZTimestamp(),
    },
    BloodPressure: {
      SystolicBP: "",
      DiastolicBP: "",
      BPUnit: "mmHg",
      Date: nowTZTimestamp(),
    },
    bodyMassIndex: { BMI: "", Date: nowTZTimestamp() },
    bodySurfaceArea: { BSA: "", Date: nowTZTimestamp() },
  });
  const [addDate, setAddDate] = useState(nowTZTimestamp());

  const lastDatas: CareElementLastDatasType = datas
    ? {
        SmokingStatus: datas.SmokingStatus?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { Status: "", Date: null },
        SmokingPacks: datas.SmokingPacks?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { PerDay: "", Date: null },
        Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Weight: "",
          WeightUnit: "kg",
          Date: null,
        },
        Height: datas.Height?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Height: "",
          HeightUnit: "cm",
          Date: null,
        },
        WaistCircumference: datas.WaistCircumference?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          WaistCircumference: "",
          WaistCircumferenceUnit: "cm",
          Date: null,
        },
        BloodPressure: datas.BloodPressure?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          SystolicBP: "",
          DiastolicBP: "",
          BPUnit: "mmHg",
          Date: null,
        },
        bodyMassIndex: datas.bodyMassIndex?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BMI: "", Date: null },
        bodySurfaceArea: datas.bodySurfaceArea?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BSA: "", Date: null },
      }
    : {
        SmokingStatus: { Status: "", Date: null },
        SmokingPacks: { PerDay: "", Date: null },
        Weight: { Weight: "", WeightUnit: "kg", Date: null },
        Height: { Height: "", HeightUnit: "cm", Date: null },
        WaistCircumference: {
          WaistCircumference: "",
          WaistCircumferenceUnit: "cm",
          Date: null,
        },
        BloodPressure: {
          SystolicBP: "",
          DiastolicBP: "",
          BPUnit: "mmHg",
          Date: null,
        },
        bodyMassIndex: { BMI: "", Date: null },
        bodySurfaceArea: { BSA: "", Date: null },
      };

  const handleClickHistory = (rowName: CareElementHistoryTopicType) => {
    setHistoryTopic(rowName);
    let historyDatasToPass: unknown[] = [];
    let historyUnitToPass = "";

    switch (rowName) {
      case "SMOKING STATUS":
        historyDatasToPass = datas.SmokingStatus?.length
          ? datas.SmokingStatus.sort((a, b) => b.Date - a.Date)
          : [];
        break;
      case "SMOKING PACKS PER DAY":
        historyDatasToPass = datas.SmokingPacks?.length
          ? datas.SmokingPacks.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "packs";
        break;
      case "WEIGHT":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "kg";
        break;
      case "WEIGHT LBS":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "lbs";
        break;
      case "HEIGHT":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "HEIGHT FEET":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "feet";
        break;
      case "WAIST CIRCUMFERENCE":
        historyDatasToPass = datas.WaistCircumference?.length
          ? datas.WaistCircumference.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "BLOOD PRESSURE":
        historyDatasToPass = datas.BloodPressure?.length
          ? datas.BloodPressure.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "mmHg";
        break;
      case "BODY MASS INDEX":
        historyDatasToPass = datas.bodyMassIndex?.length
          ? datas.bodyMassIndex.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "kg/m2";
        break;
      case "BODY SURFACE AREA":
        historyDatasToPass = datas.bodySurfaceArea?.length
          ? datas.bodySurfaceArea.sort((a, b) => b.Date - a.Date)
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

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await careElementsSchema.validate(addFormDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (
      (addFormDatas.SmokingStatus?.Status === "Y" ||
        addFormDatas.SmokingStatus?.Status === "N") &&
      !addFormDatas.SmokingPacks?.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required (type 0 if no smoking)");
      return;
    }
    if (
      addFormDatas.BloodPressure?.SystolicBP &&
      !addFormDatas.BloodPressure?.DiastolicBP
    ) {
      setErrMsgPost("Diastolic field is required if you enter Systolic");
      return;
    }
    if (
      addFormDatas.BloodPressure?.DiastolicBP &&
      !addFormDatas.BloodPressure?.SystolicBP
    ) {
      setErrMsgPost("Systolic field is required if you enter Diastolic");
      return;
    }

    const careElementToPut: CareElementType = {
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
      bodyMassIndex: addFormDatas.bodyMassIndex?.BMI //if BMI is entered
        ? [...datas.bodyMassIndex, addFormDatas.bodyMassIndex] // add it to the array
        : addFormDatas.Weight?.Weight // if weight is entered, calculate BMI and add it to the array
        ? [
            ...datas.bodyMassIndex,
            {
              //retrieve the last height before the date of the new weight and calculate BMI
              BMI: bodyMassIndex(
                datas.Height.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => b.Date - a.Date)
                  .at(-1)?.Height ?? "",
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
                datas.Weight.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1)?.Weight ?? ""
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
                  .at(-1)?.Height ?? "",
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
                  .at(-1)?.Weight ?? ""
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
          SmokingStatus: { Status: "", Date: nowTZTimestamp() },
          SmokingPacks: { PerDay: "", Date: nowTZTimestamp() },
          Weight: { Weight: "", WeightUnit: "kg", Date: nowTZTimestamp() },
          WeightLbs: { Weight: "", WeightUnit: "lbs", Date: nowTZTimestamp() },
          Height: { Height: "", HeightUnit: "cm", Date: nowTZTimestamp() },
          HeightFeet: {
            Height: "",
            HeightUnit: "feet",
            Date: nowTZTimestamp(),
          },
          WaistCircumference: {
            WaistCircumference: "",
            WaistCircumferenceUnit: "cm",
            Date: nowTZTimestamp(),
          },
          BloodPressure: {
            SystolicBP: "",
            DiastolicBP: "",
            BPUnit: "mmHg",
            Date: nowTZTimestamp(),
          },
          bodyMassIndex: { BMI: "", Date: nowTZTimestamp() },
          bodySurfaceArea: { BSA: "", Date: nowTZTimestamp() },
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
              addFormDatas={addFormDatas}
              setAddFormDatas={setAddFormDatas}
              setErrMsgPost={setErrMsgPost}
              addDate={addDate}
              setAddDate={setAddDate}
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
