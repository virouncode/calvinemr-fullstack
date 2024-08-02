
import {
    toCodeTableName,
    ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
    cmToFeet,
    kgToLbs,
} from "../../../../../utils/measurements/measurements";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const CareElementsContent = ({ topicDatas, isPending, error }) => {
  //HOOKS
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas.pages?.flatMap((page) => page.items)[0];
  const lastDatas = datas
    ? {
        SmokingStatus: datas.SmokingStatus?.sort((a, b) => b.Date - a.Date)[0],
        SmokingPacks: datas.SmokingPacks?.sort((a, b) => b.Date - a.Date)[0],
        Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)[0],
        Height: datas.Height?.sort((a, b) => b.Date - a.Date)[0],
        WaistCircumference: datas.WaistCircumference?.sort(
          (a, b) => b.Date - a.Date
        )[0],
        BloodPressure: datas.BloodPressure?.sort((a, b) => b.Date - a.Date)[0],
        bodyMassIndex: datas.bodyMassIndex?.sort((a, b) => b.Date - a.Date)[0],
        bodySurfaceArea: datas.bodySurfaceArea?.sort(
          (a, b) => b.Date - a.Date
        )[0],
      }
    : null;

  return (
    <div className="topic-content">
      {lastDatas ? (
        <>
          <p>
            <label>Smoking: </label>
            {toCodeTableName(
              ynIndicatorsimpleCT,
              lastDatas.SmokingStatus?.Status
            )}
          </p>
          <p>
            <label>Smoking Packs (per day): </label>
            {lastDatas.SmokingPacks?.PerDay}
          </p>
          <p>
            <label>Weight (kg): </label>
            {lastDatas.Weight?.Weight}
          </p>
          <p>
            <label>Weight (lbs): </label>
            {kgToLbs(lastDatas.Weight?.Weight)}
          </p>
          <p>
            <label>Height (cm): </label>
            {lastDatas.Height?.Height}
          </p>
          <p>
            <label>Height (feet): </label>
            {cmToFeet(lastDatas.Height?.Height)}
          </p>
          <p>
            <label>Body Mass Index (kg/m2): </label>
            {lastDatas.bodyMassIndex?.BMI}
          </p>
          <p>
            <label>Body Surface Area (m2): </label>
            {lastDatas.bodySurfaceArea?.BSA}
          </p>
          <p>
            <label>Waist Circumference (cm): </label>
            {lastDatas.WaistCircumference?.WaistCircumference}
          </p>
          <p>
            <label>Systolic(mmHg): </label>
            {lastDatas.BloodPressure?.SystolicBP}
          </p>
          <p>
            <label>Diastolic(mmHg): </label>
            {lastDatas.BloodPressure?.DiastolicBP}
          </p>
        </>
      ) : (
        "No care elements"
      )}
    </div>
  );
};

export default CareElementsContent;
