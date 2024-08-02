import {
  allImmunizationsAges,
  recommendedImmunizationsList,
} from "../../../../../utils/immunizations/recommendedImmunizations";
import RecImmunizationCell from "./RecImmunizationCell";
import RecImmunizationEmptyCell from "./RecImmunizationEmptyCell";

const RecImmunizationRow = ({
  type,
  patientDob,
  immunizationInfos,
  patientId,
  loadingPatient,
  errPatient,
  topicPost,
  topicPut,
  topicDelete,
}) => {
  const immunization = recommendedImmunizationsList.find(
    (immunization) => immunization.type === type
  );
  const immunizationId = immunization.id;
  const immunizationType = immunization.type;
  const immunizationAges = immunization.ages;
  const immunizationDose = immunization.dose;
  const immunizationRoute = immunization.route;
  const allImmunizationsAgesToDisplay =
    immunizationId === 16
      ? allImmunizationsAges.slice(0, 8)
      : immunizationId === 17
      ? allImmunizationsAges.slice(0, 3)
      : immunizationId === 13
      ? allImmunizationsAges.slice(0, 11)
      : allImmunizationsAges;

  return allImmunizationsAgesToDisplay.map((immunizationAge, index) =>
    immunizationAges.includes(immunizationAge) ? (
      <RecImmunizationCell
        key={index}
        age={immunizationAge}
        type={immunizationType}
        route={immunizationRoute}
        immunizationId={immunizationId}
        dose={immunizationDose}
        immunizationInfos={immunizationInfos.filter(
          ({ age }) => age === immunizationAge
        )}
        patientDob={patientDob}
        patientId={patientId}
        loadingPatient={loadingPatient}
        errPatient={errPatient}
        topicPost={topicPost}
        topicPut={topicPut}
        topicDelete={topicDelete}
      />
    ) : (
      <RecImmunizationEmptyCell key={index} />
    )
  );
};

export default RecImmunizationRow;
