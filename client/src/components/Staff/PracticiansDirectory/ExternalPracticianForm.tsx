import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../omdDatas/codesTables";
import { DoctorFormType, DoctorType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { doctorSchema } from "../../../validation/record/doctorValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputTel from "../../UI/Inputs/InputTel";
import GenericList from "../../UI/Lists/GenericList";
import PostalZipSelectInput from "../../UI/Lists/PostalZipSelectInput";
import FormSignCell from "../../UI/Tables/FormSignCell";

type ExternalPracticianFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  doctorPost: UseMutationResult<
    DoctorType,
    Error,
    Partial<DoctorType>,
    unknown
  >;
};

const ExternalPracticianForm = ({
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  doctorPost,
}: ExternalPracticianFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<DoctorFormType>({
    firstName: "",
    lastName: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    phone: "",
    fax: "",
    email: "",
    speciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    patients: [],
  });
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
    // Validation
    try {
      await doctorSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const doctorToPost: Partial<DoctorType> = {
      FirstName: firstLetterUpper(formDatas.firstName),
      LastName: firstLetterUpper(formDatas.lastName),
      Address: {
        _addressType: "M",
        Structured: {
          Line1: firstLetterUpper(formDatas.line1),
          City: firstLetterUpper(formDatas.city),
          CountrySubDivisionCode: formDatas.province,
          PostalZipCode: {
            PostalCode: formDatas.postalCode,
            ZipCode: formDatas.zipCode,
          },
        },
      },
      PhoneNumber: [
        {
          _phoneNumberType: "W",
          phoneNumber: formDatas.phone,
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: formDatas.fax,
      },
      EmailAddress: formDatas.email.toLowerCase(),
      speciality: firstLetterUpper(formDatas.speciality),
      licence_nbr: formDatas.licence_nbr,
      ohip_billing_nbr: formDatas.ohip_billing_nbr,
      patients: [],
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Submission
    setProgress(true);
    doctorPost.mutate(doctorToPost, {
      onSuccess: () => {
        setAddVisible(false);
      },
      onSettled: () => setProgress(false),
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="doctors__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="doctors__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          name="lastName"
          value={formDatas.lastName}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="firstName"
          value={formDatas.firstName}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="speciality"
          value={formDatas.speciality}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="licence_nbr"
          value={formDatas.licence_nbr}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="ohip_billing_nbr"
          value={formDatas.ohip_billing_nbr}
          onChange={handleChange}
        />
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

export default ExternalPracticianForm;
