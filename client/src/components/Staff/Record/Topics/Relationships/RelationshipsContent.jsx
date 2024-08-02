
import { NavLink } from "react-router-dom";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const RelationshipsContent = ({ topicDatas, isPending, error }) => {
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
        <ul>
          {datas.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.relationship} of{" "}
              <NavLink
                to={`/staff/patient-record/${item.relation_id}`}
                className="topic-content__link"
              >
                {toPatientName(item.relation_infos)}
              </NavLink>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No relationships"
      )}
    </div>
  );
};

export default RelationshipsContent;
