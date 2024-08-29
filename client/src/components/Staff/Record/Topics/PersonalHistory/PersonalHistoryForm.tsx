import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  PersonalHistoryFormType,
  PersonalHistoryType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { personalHistorySchema } from "../../../../../validation/record/personalHistoryValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type PersonalHistoryFormProps = {
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  topicPost: UseMutationResult<
    PersonalHistoryType,
    Error,
    Partial<PersonalHistoryType>,
    void
  >;
};

const PersonalHistoryForm = ({
  setPopUpVisible,
  patientId,
  topicPost,
}: PersonalHistoryFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<PersonalHistoryFormType>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleClose = () => {
    setPopUpVisible(false);
  };
  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    if (!Object.values(formDatas).some((v) => v) || !formDatas) {
      setErrMsgPost("Please fill at least one field");
      return;
    }
    try {
      await personalHistorySchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const topicToPost: Partial<PersonalHistoryType> = {
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
        ].filter((element) => element) as {
          Name: string;
          DataType: string;
          Content: string;
        }[],
      },
    };
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  return (
    <form className="personalhistory-form">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="personalhistory-form__row">
        <Input
          value={formDatas.occupations}
          name="occupations"
          onChange={handleChange}
          id="occupations"
          label="Occupations:"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Income:"
          value={formDatas.income}
          name="income"
          onChange={handleChange}
          id="income"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Religion:"
          value={formDatas.religion}
          name="religion"
          onChange={handleChange}
          id="religion"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Sexual orientation:"
          value={formDatas.sexual_orientation}
          name="sexual_orientation"
          onChange={handleChange}
          id="sexual"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Special diet:"
          value={formDatas.special_diet}
          name="special_diet"
          onChange={handleChange}
          id="diet"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Smoking:"
          value={formDatas.smoking}
          name="smoking"
          onChange={handleChange}
          id="smoking"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Alcohol:"
          value={formDatas.alcohol}
          name="alcohol"
          onChange={handleChange}
          id="alcohol"
        />
      </div>
      <div className="personalhistory-form__row">
        <Input
          label="Recreational drugs:"
          value={formDatas.recreational_drugs}
          name="recreational_drugs"
          onChange={handleChange}
          id="drugs"
        />
      </div>
      <div className="personalhistory-form__btns">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CloseButton onClick={handleClose} disabled={progress} />
      </div>
    </form>
  );
};

export default PersonalHistoryForm;
