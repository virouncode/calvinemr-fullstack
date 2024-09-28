import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../../../omdDatas/codesTables";
import { PharmacyFormType, PharmacyType } from "../../../../../types/api";
import { UserPatientType, UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../../../validation/record/pharmacyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputEmail from "../../../../UI/Inputs/InputEmail";
import InputTel from "../../../../UI/Inputs/InputTel";
import GenericList from "../../../../UI/Lists/GenericList";
import PostalZipSelectInput from "../../../../UI/Lists/PostalZipSelectInput";
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type PharmacyFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    PharmacyType,
    Error,
    Partial<PharmacyType>,
    void
  >;
};

const PharmacyForm = ({
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: PharmacyFormProps) => {
  //HOOKS
  const { user } = useUserContext() as {
    user: UserStaffType | UserPatientType;
  };
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState<PharmacyFormType>({
    name: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    phone: "",
    fax: "",
    email: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
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

  const handleSubmit = async () => {
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
      created_by_id: user.access_level === "staff" ? user.id : 0,
    };

    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: async () => {
        editCounter.current -= 1;
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="pharmacies-list__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="pharmacies-list__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input name="name" value={formDatas.name} onChange={handleChange} />
      </td>
      <td>
        <Input name="line1" value={formDatas.line1} onChange={handleChange} />
      </td>
      <td>
        <Input name="city" value={formDatas.city} onChange={handleChange} />
      </td>
      <td>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
          placeHolder="Choose a province/state..."
        />
      </td>
      <td>
        <PostalZipSelectInput
          onChangeSelect={handleChangePostalOrZip}
          onChangeInput={handleChange}
          postalOrZip={postalOrZip}
          label={false}
          value={
            postalOrZip === "postal" ? formDatas.postalCode : formDatas.zipCode
          }
          id="postalZipCode"
          placeholder={
            postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
          }
          name="postalZipCode"
        />
      </td>
      <td>
        <InputTel
          name="phone"
          value={formDatas.phone}
          onChange={handleChange}
          placeholder="xxx-xxx-xxxx"
        />
      </td>
      <td>
        <InputTel
          name="fax"
          value={formDatas.fax}
          onChange={handleChange}
          placeholder="xxx-xxx-xxxx"
        />
      </td>
      <td>
        <InputEmail
          name="email"
          value={formDatas.email}
          onChange={handleChange}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default PharmacyForm;
