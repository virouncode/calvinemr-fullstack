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
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import InputNumber from "../../../../UI/Inputs/InputNumber";
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
          <SaveButton onClick={handleSubmit} disabled={progress} />
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
        <InputDate
          name="date_of_event"
          value={timestampToDateISOTZ(formDatas.date_of_event)}
          onChange={handleChange}
          width={120}
        />
      </td>
      <td>
        <Input
          name="premises"
          value={formDatas.premises}
          onChange={handleChange}
          width={100}
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
          <InputNumber
            name="term_nbr_of_weeks"
            value={formDatas.term_nbr_of_weeks}
            onChange={handleChange}
            width={50}
          />
          w
          <InputNumber
            name="term_nbr_of_days"
            value={formDatas.term_nbr_of_days}
            onChange={handleChange}
            width={50}
          />
          d
        </div>
      </td>
      <td>
        <Input
          name="notes"
          value={formDatas.notes}
          onChange={handleChange}
          width={100}
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
