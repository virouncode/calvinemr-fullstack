
import { getImmunizationInterval } from "../../../../../utils/immunizations/getImmunizationInterval";
import RecImmunizationItemDouble from "./RecImmunizationItemDouble";
import RecImmunizationItemMultiple from "./RecImmunizationItemMultiple";
import RecImmunizationItemSingle from "./RecImmunizationItemSingle";

const RecImmunizationCell = ({
  age,
  type,
  route,
  immunizationId,
  dose,
  immunizationInfos,
  patientDob,
  patientId,
  loadingPatient,
  errPatient,
  topicPost,
  topicPut,
  topicDelete,
}) => {
  return (
    immunizationInfos && (
      <td
        colSpan={
          immunizationId === 16
            ? "5"
            : immunizationId === 17
            ? "10"
            : immunizationId === 13
            ? "2"
            : "0"
        }
      >
        {dose === "single" ? ( //single dose
          <RecImmunizationItemSingle
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos[0] || {}}
            rangeStart={getImmunizationInterval(age, patientDob).rangeStart}
            rangeEnd={getImmunizationInterval(age, patientDob).rangeEnd}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        ) : //double dose
        dose === "double" ? (
          <RecImmunizationItemDouble
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            patientDob={patientDob}
            rangeStart={getImmunizationInterval(age, patientDob).rangeStart}
            rangeEnd={getImmunizationInterval(age, patientDob).rangeEnd}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        ) : (
          <RecImmunizationItemMultiple
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            patientId={patientId}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        )}
      </td>
    )
  );
};
export default RecImmunizationCell;
