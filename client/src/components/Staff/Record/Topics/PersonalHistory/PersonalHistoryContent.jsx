
import { getResidualInfo } from "../../../../../utils/migration/exports/getResidualInfo";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const PersonalHistoryContent = ({ topicDatas, isPending, error }) => {
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
  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <>
          <p>
            <label>Occupations: </label>
            {getResidualInfo("Occupations", datas[0])}
          </p>
          <p>
            <label>Income: </label>
            {getResidualInfo("Income", datas[0])}
          </p>
          <p>
            <label>Religion: </label>
            {getResidualInfo("Religion", datas[0])}
          </p>
          <p>
            <label>Sexual orientation: </label>
            {getResidualInfo("SexualOrientation", datas[0])}
          </p>
          <p>
            <label>Special diet: </label>
            {getResidualInfo("SpecialDiet", datas[0])}
          </p>
          <p>
            <label>Smoking: </label>
            {getResidualInfo("Smoking", datas[0])}
          </p>
          <p>
            <label>Alcohol: </label>
            {getResidualInfo("Alcohol", datas[0])}
          </p>
          <p>
            <label>Recreational drugs: </label>
            {getResidualInfo("RecreationalDrugs", datas[0])}
          </p>
        </>
      ) : (
        "No personal history"
      )}
    </div>
  );
};

export default PersonalHistoryContent;
