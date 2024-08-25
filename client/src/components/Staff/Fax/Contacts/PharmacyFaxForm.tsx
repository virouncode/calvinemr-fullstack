import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useTopicPost } from "../../../../hooks/reactquery/mutations/topicMutations";
import { provinceStateTerritoryCT } from "../../../../omdDatas/codesTables";
import { PharmacyType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../../validation/record/pharmacyValidation";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";
import InputEmail from "../../../UI/Inputs/InputEmail";
import InputTel from "../../../UI/Inputs/InputTel";
import GenericList from "../../../UI/Lists/GenericList";
import PostalZipSelect from "../../../UI/Lists/PostalZipSelect";
import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";

type PharmacyFaxFormProps = {
  initialFaxNumber: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setAddFaxNumberVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PharmacyFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}: PharmacyFaxFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
    name: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    phone: "",
    fax: initialFaxNumber,
    email: "",
  });
  const [progress, setProgress] = useState(false);
  //Queries
  const topicPost = useTopicPost("PHARMACIES", 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postalCode: value, zipCode: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, postalCode: "", zipCode: value });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Validation
    try {
      await pharmacySchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const topicToPost: Partial<PharmacyType> = {
      Name: firstLetterUpper(formDatas.name),
      Address: {
        Structured: {
          Line1: firstLetterUpper(formDatas.line1),
          City: firstLetterUpper(formDatas.city),
          CountrySubDivisionCode: formDatas.province,
          PostalZipCode: {
            PostalCode: formDatas.postalCode,
            ZipCode: formDatas.zipCode,
          },
        },
        _addressType: "M",
      },
      PhoneNumber: [
        {
          phoneNumber: formDatas.phone,
          _phoneNumberType: "W",
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: formDatas.fax,
      },
      EmailAddress: formDatas.email.toLowerCase(),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
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
    <div className="pharmacy-fax__form">
      <div className="pharmacy-fax__form-row">
        <Input
          value={formDatas.name}
          onChange={handleChange}
          name="name"
          label="Name:"
          autoFocus={true}
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <Input
          value={formDatas.line1}
          onChange={handleChange}
          name="line1"
          label="Address:"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <Input
          value={formDatas.city}
          onChange={handleChange}
          name="city"
          label="City:"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
          label="Province/State:"
        />
      </div>
      <div className="pharmacy-fax__form-row pharmacy-fax__form-row--postal">
        <PostalZipSelect
          onChange={handleChangePostalOrZip}
          postalOrZip={postalOrZip}
        />
        <Input
          value={
            postalOrZip === "postal" ? formDatas.postalCode : formDatas.zipCode
          }
          onChange={handleChange}
          name="postalZipCode"
          id="postalZipCode"
          width={57}
          placeholder={
            postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
          }
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <InputTel
          value={formDatas.phone}
          onChange={handleChange}
          name="phone"
          id="phone"
          label="Phone"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <InputTel
          value={formDatas.fax}
          onChange={handleChange}
          name="fax"
          id="fax"
          label="Fax"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <InputEmail
          value={formDatas.email}
          onChange={handleChange}
          name="email"
          id="email"
          label="Email"
        />
      </div>
      <div className="pharmacy-fax__form-btns">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
        {progress && <CircularProgressSmall />}
      </div>
    </div>
  );
};

export default PharmacyFaxForm;
