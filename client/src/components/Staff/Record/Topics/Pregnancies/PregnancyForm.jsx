import { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pregnancySchema } from "../../../../../validation/record/pregnancyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import PregnanciesList from "./PregnanciesList";

const PregnancyForm = ({
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
    description: "",
    date_of_event: nowTZTimestamp(),
    premises: "",
    term_nbr_of_weeks: "",
    term_nbr_of_days: "",
    notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_of_event") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      value = parseInt(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleChangePregnancyEvent = (value) => {
    setFormDatas({ ...formDatas, description: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Fomatting
    const topicToPost = {
      ...formDatas,
      premises: firstLetterOfFirstWordUpper(formDatas.premises),
      notes: firstLetterOfFirstWordUpper(formDatas.notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    const formDatasForValidation = { ...formDatas };
    if (formDatasForValidation.term_nbr_of_weeks === "") {
      formDatasForValidation.term_nbr_of_weeks = 0;
    }
    if (formDatasForValidation.term_nbr_of_days === "") {
      formDatasForValidation.term_nbr_of_days = 0;
    }

    //Vaidation
    try {
      await pregnancySchema.validate(formDatasForValidation);
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
      className="pregnancies-form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="pregnancies-form__btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <PregnanciesList
          value={formDatas.description}
          handleChange={handleChangePregnancyEvent}
        />
      </td>
      <td>
        <input
          name="date_of_event"
          type="date"
          value={timestampToDateISOTZ(formDatas.date_of_event)}
          onChange={handleChange}
          className="pregnancies-form__input2"
        />
      </td>
      <td>
        <input
          name="premises"
          type="text"
          value={formDatas.premises}
          onChange={handleChange}
          autoComplete="off"
          className="pregnancies-form__input1"
        />
      </td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            name="term_nbr_of_weeks"
            type="number"
            value={formDatas.term_nbr_of_weeks}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form__input3"
          />
          w
          <input
            name="term_nbr_of_days"
            type="number"
            value={formDatas.term_nbr_of_days}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form__input3"
          />
          d
        </div>
      </td>
      <td>
        <input
          name="notes"
          type="text"
          value={formDatas.notes}
          onChange={handleChange}
          autoComplete="off"
          className="pregnancies-form__input1"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>{" "}
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default PregnancyForm;
