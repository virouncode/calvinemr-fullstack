import { InfiniteData } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ReminderType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type RemindersDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<ReminderType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const RemindersDropDown = ({
  topicDatas,
  isPending,
  error,
}: RemindersDropDownProps) => {
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
  const datas = topicDatas?.pages.flatMap((page) => page.items);

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

export default RemindersDropDown;
