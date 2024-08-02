
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const TodosContent = ({ topicDatas, isPending, error }) => {
  const { user } = useUserContext();
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
  const datas = topicDatas.pages
    .flatMap((page) => page.items)
    .filter((message) => message.to_staff_id === user.id);

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((message) => (
            <li
              className="topic-content__item"
              key={message.id}
              style={{ textDecoration: message.done && "line-through" }}
            >
              <div className="topic-content__overview">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/To-dos/Internal`}
                >
                  {message.subject} - {message.body}
                </NavLink>
              </div>
              <div className="topic-content__date">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/To-dos/Internal`}
                >
                  {timestampToDateISOTZ(message.date_created)}
                </NavLink>
              </div>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No to-dos about patient"
      )}
    </div>
  );
};

export default TodosContent;
