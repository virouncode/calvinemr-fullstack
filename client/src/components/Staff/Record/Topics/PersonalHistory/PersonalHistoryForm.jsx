import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { personalHistorySchema } from "../../../../../validation/record/personalHistoryValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";

const PersonalHistoryForm = ({ setPopUpVisible, patientId, topicPost }) => {
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    occupations: "",
    income: "",
    religion: "",
    sexual_orientation: "",
    special_diet: "",
    smoking: "",
    alcohol: "",
    recreational_drugs: "",
  });
  const [errMsgPost, setErrMsgPost] = useState("");
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleClose = (e) => {
    e.preventDefault();
    setPopUpVisible(false);
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Validation
    if (!Object.values(formDatas).some((v) => v) || !formDatas) {
      setErrMsgPost("Please fill at least one field");
      return;
    }
    try {
      await personalHistorySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const topicToPost = {
      patient_id: patientId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      ResidualInfo: {
        DataElement: [
          formDatas.occupations && {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.occupations),
          },
          formDatas.income && {
            Name: "Income",
            DataType: "text",
            Content: formDatas.income,
          },
          formDatas.religion && {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.religion),
          },
          formDatas.sexual_orientation && {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.sexual_orientation),
          },
          formDatas.special_diet && {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.special_diet),
          },
          formDatas.smoking && {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.smoking),
          },
          formDatas.alcohol && {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.alcohol),
          },
          formDatas.recreational_drugs && {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.recreational_drugs),
          },
        ].filter((element) => element),
      },
    };
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  return (
    <form className="personalhistory-form">
      {errMsgPost && (
        <div className="personalhistory-form__err">{errMsgPost}</div>
      )}
      <p>
        <label htmlFor="occupations">Occupations: </label>
        <input
          type="text"
          value={formDatas.occupations}
          name="occupations"
          onChange={handleChange}
          autoComplete="off"
          id="occupations"
        />
      </p>
      <p>
        <label htmlFor="income">Income: </label>
        <input
          type="text"
          value={formDatas.income}
          name="income"
          onChange={handleChange}
          autoComplete="off"
          id="income"
        />
      </p>
      <p>
        <label htmlFor="religion">Religion: </label>
        <input
          type="text"
          value={formDatas.religion}
          name="religion"
          onChange={handleChange}
          autoComplete="off"
          id="religion"
        />
      </p>
      <p>
        <label htmlFor="sexual">Sexual orientation: </label>
        <input
          type="text"
          value={formDatas.sexual_orientation}
          name="sexual_orientation"
          onChange={handleChange}
          autoComplete="off"
          id="sexual"
        />
      </p>
      <p>
        <label htmlFor="diet">Special diet: </label>
        <input
          type="text"
          value={formDatas.special_diet}
          name="special_diet"
          onChange={handleChange}
          autoComplete="off"
          id="diet"
        />
      </p>
      <p>
        <label htmlFor="smoking">Smoking: </label>
        <input
          type="text"
          value={formDatas.smoking}
          name="smoking"
          onChange={handleChange}
          autoComplete="off"
          id="smoking"
        />
      </p>
      <p>
        <label htmlFor="alcohol">Alcohol: </label>
        <input
          type="text"
          value={formDatas.alcohol}
          name="alcohol"
          onChange={handleChange}
          autoComplete="off"
          id="alcohol"
        />
      </p>
      <p>
        <label htmlFor="drugs">Recreational drugs: </label>
        <input
          type="text"
          value={formDatas.recreational_drugs}
          name="recreational_drugs"
          onChange={handleChange}
          autoComplete="off"
          id="drugs"
        />
      </p>
      <p className="personalhistory-form__btns">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CloseButton onClick={handleClose} disabled={progress} />
      </p>
    </form>
  );
};

export default PersonalHistoryForm;
