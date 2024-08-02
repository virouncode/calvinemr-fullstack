
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const MessagesContent = ({ topicDatas, isPending, error }) => {
  const { user } = useUserContext();
  const getSection = (message) => {
    if (message.deleted_by_staff_ids.includes(user.id)) {
      return "Deleted messages";
    } else if (message.from_id === user.id) {
      //et le cas forward ???
      return "Sent messages";
    } else {
      return "Received messages";
    }
  };
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
    .filter(
      (message) =>
        message.from_id === user.id || message.to_staff_ids.includes(user.id)
    );

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((message) => (
            <li className="topic-content__item" key={message.id}>
              <div className="topic-content__overview">
                <NavLink
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/Internal`}
                  style={{ textDecoration: "underline" }}
                >
                  - {message.subject} - {message.body}
                </NavLink>
              </div>
              <div className="topic-content__date">
                <NavLink
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/Internal`}
                  style={{ textDecoration: "underline" }}
                >
                  {timestampToDateISOTZ(message.date_created)}
                </NavLink>
              </div>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No messages about patient"
      )}
    </div>
  );
};

export default MessagesContent;
