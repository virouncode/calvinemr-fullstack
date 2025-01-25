import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ReminderType } from "../../../../../types/api";

type RemindersDropDownProps = {
  data: ReminderType[];
};

const RemindersDropDown = ({ data }: RemindersDropDownProps) => {
  useEffect(() => {
    if (data) {
      data.forEach((reminder) => {
        toast.info(reminder.reminder, { autoClose: 2000, containerId: "A" });
      });
    }
  }, [data]);

  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
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
