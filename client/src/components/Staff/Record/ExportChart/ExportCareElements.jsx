
import {
    toCodeTableName,
    ynIndicatorsimpleCT,
} from "../../../../omdDatas/codesTables";
import { cmToFeet, kgToLbs } from "../../../../utils/measurements/measurements";

const ExportCareElements = ({ topicDatas }) => {
  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#577399",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  const lastDatas =
    topicDatas && topicDatas.length > 0
      ? {
          SmokingStatus: topicDatas[0].SmokingStatus?.sort(
            (a, b) => b.Date - a.Date
          )[0],
          SmokingPacks: topicDatas[0].SmokingPacks?.sort(
            (a, b) => b.Date - a.Date
          )[0],
          Weight: topicDatas[0].Weight?.sort((a, b) => b.Date - a.Date)[0],
          Height: topicDatas[0].Height?.sort((a, b) => b.Date - a.Date)[0],
          WaistCircumference: topicDatas[0].WaistCircumference?.sort(
            (a, b) => b.Date - a.Date
          )[0],
          BloodPressure: topicDatas[0].BloodPressure?.sort(
            (a, b) => b.Date - a.Date
          )[0],
          bodyMassIndex: topicDatas[0].bodyMassIndex?.sort(
            (a, b) => b.Date - a.Date
          )[0],
          bodySurfaceArea: topicDatas[0].bodySurfaceArea?.sort(
            (a, b) => b.Date - a.Date
          )[0],
        }
      : null;
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>CARE ELEMENTS</p>
      <div style={CONTENT_STYLE}>
        {lastDatas ? (
          <ul className="export__list">
            <>
              <li>
                - Smoking:{" "}
                {toCodeTableName(
                  ynIndicatorsimpleCT,
                  lastDatas.SmokingStatus?.Status
                )}
              </li>
              <li>
                - Smoking Packs (per day): {lastDatas.SmokingPacks?.PerDay}
              </li>
              <li>- Weight (kg): {lastDatas.Weight?.Weight}</li>
              <li>- Weight (lbs): {kgToLbs(lastDatas.Weight?.Weight)}</li>
              <li>- Height (cm): {lastDatas.Height?.Height}</li>
              <li>- Height (feet): {cmToFeet(lastDatas.Height?.Height)}</li>
              <li>- Body Mass Index (kg/m2): {lastDatas.bodyMassIndex?.BMI}</li>
              <li>
                - Body Surface Area (m2): {lastDatas.bodySurfaceArea?.BSA}
              </li>
              <li>
                - Waist Circumference (cm):{" "}
                {lastDatas.WaistCircumference?.WaistCircumference}
              </li>
              <li>- Systolic(mmHg): {lastDatas.BloodPressure?.SystolicBP}</li>
              <li>- Diastolic(mmHg): {lastDatas.BloodPressure?.DiastolicBP}</li>
            </>
          </ul>
        ) : (
          "No care elements"
        )}
      </div>
    </div>
  );
};

export default ExportCareElements;
