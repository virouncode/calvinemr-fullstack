import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useFaxDirectoryPost } from "../../../../hooks/reactquery/mutations/faxDirectoryMutations";
import { FaxContactType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import { otherSchema } from "../../../../validation/others/otherValidation";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";
import InputTel from "../../../UI/Inputs/InputTel";
import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";

type OtherFaxFormProps = {
  initialFaxNumber: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setAddFaxNumberVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const OtherFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}: OtherFaxFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState({
    name: "",
    category: "",
    fax: initialFaxNumber,
  });
  const [progress, setProgress] = useState(false);
  const faxDirectoryPost = useFaxDirectoryPost();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Validation
    try {
      await otherSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const otherToPost: Partial<FaxContactType> = {
      name: firstLetterUpper(formDatas.name),
      category: firstLetterUpper(formDatas.category),
      fax_number: formDatas.fax,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    setProgress(true);
    //Submission

    faxDirectoryPost.mutate(otherToPost, {
      onSuccess: () => {
        setAddFaxNumberVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setAddFaxNumberVisible(false);
  };

  return (
    <div className="other-fax__form">
      <div className="other-fax__form-row">
        <Input
          value={formDatas.name}
          onChange={handleChange}
          name="name"
          label="Name:"
          autoFocus={true}
        />
      </div>
      <div className="other-fax__form-row">
        <Input
          value={formDatas.category}
          onChange={handleChange}
          name="category"
          label="Category:"
        />
      </div>
      <div className="other-fax__form-row">
        <InputTel
          value={formDatas.fax}
          onChange={handleChange}
          name="fax"
          label="Fax:"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="other-fax__form-btns">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
        {progress && <CircularProgressSmall />}
      </div>
    </div>
  );
};

export default OtherFaxForm;
