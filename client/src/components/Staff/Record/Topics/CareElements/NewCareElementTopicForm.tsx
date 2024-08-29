import React, { useState } from "react";
import { CareElementAdditionalFormType } from "../../../../../types/api";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import Input from "../../../../UI/Inputs/Input";

type NewCareElementTopicFormProps = {
  setAddFormAdditionalDatas: React.Dispatch<
    React.SetStateAction<CareElementAdditionalFormType>
  >;
  setAddTopic: React.Dispatch<React.SetStateAction<boolean>>;
  addDate: number;
};

const NewCareElementTopicForm = ({
  setAddFormAdditionalDatas,
  setAddTopic,
  addDate,
}: NewCareElementTopicFormProps) => {
  const [topicName, setTopicName] = useState<string>("");
  const [topicUnit, setTopicUnit] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormAdditionalDatas((prev) => [
      ...prev,
      {
        Unit: topicUnit,
        Name: firstLetterUpper(topicName),
        Data: {
          Value: "",
          Date: addDate,
        },
      },
    ]);
    setAddTopic(false);
  };
  return (
    <form className="care-elements__add-topic-form" onSubmit={handleSubmit}>
      <div className="care-elements__add-topic-form-row">
        <Input
          label="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          width={200}
        />
      </div>
      <div className="care-elements__add-topic-form-row">
        <Input
          label="Topic Unit"
          value={topicUnit}
          onChange={(e) => setTopicUnit(e.target.value)}
          width={200}
        />
      </div>
      <div className="care-elements__add-topic-form-btns">
        <SubmitButton label="Save" />
        <CancelButton onClick={() => setAddTopic(false)} />
      </div>
    </form>
  );
};

export default NewCareElementTopicForm;
