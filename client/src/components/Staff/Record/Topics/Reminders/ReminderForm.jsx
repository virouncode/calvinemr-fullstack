import { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { reminderSchema } from "../../../../../validation/record/reminderValidation";

const ReminderForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    reminder: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "active") {
      value = value === "true";
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      reminder: firstLetterOfFirstWordUpper(formDatas.reminder),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await reminderSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <tr
      className="reminders__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="reminders__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button type="button" onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <input
          type="text"
          value={formDatas.reminder}
          name="reminder"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default ReminderForm;
