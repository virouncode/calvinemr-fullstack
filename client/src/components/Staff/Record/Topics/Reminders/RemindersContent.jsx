import { useEffect } from "react";
import { toast } from "react-toastify";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const RemindersContent = ({ topicDatas, isPending, error }) => {
  useEffect(() => {
    if (topicDatas) {
      topicDatas.pages
        .flatMap((page) => page.items)
        .forEach((reminder) => {
          toast.info(reminder.reminder, { autoClose: 2000, containerId: "A" });
        });
    }
  }, [topicDatas]);

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
              - {item.reminder}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No reminders"
      )}
    </div>
  );
};

export default RemindersContent;
