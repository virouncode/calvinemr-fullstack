import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useDoctorPost } from "../../../../hooks/reactquery/mutations/doctorsMutations";
import { provinceStateTerritoryCT } from "../../../../omdDatas/codesTables";
import { DoctorType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import { doctorSchema } from "../../../../validation/record/doctorValidation";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";
import InputEmail from "../../../UI/Inputs/InputEmail";
import InputTel from "../../../UI/Inputs/InputTel";
import GenericList from "../../../UI/Lists/GenericList";
import PostalZipSelect from "../../../UI/Lists/PostalZipSelect";

type DoctorFaxFormProps = {
  initialFaxNumber: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setAddFaxNumberVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const DoctorFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}: DoctorFaxFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
    firstName: "",
    lastName: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    phone: "",
    fax: initialFaxNumber,
    email: "",
    speciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    patients: [],
  });
  const [progress, setProgress] = useState(false);
  //Queries
  const doctorPost = useDoctorPost();

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
        setAddFaxNumberVisible(false);
        setProgress(false);
      },
      onError: () => setProgress(false),
    });
  };

  const handleCancel = () => {
    setAddFaxNumberVisible(false);
  };

  return (
    <div className="doctor-fax__form">
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.lastName}
          onChange={handleChange}
          name="lastName"
          id="lastName"
          label="Last Name"
          autoFocus={true}
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.firstName}
          onChange={handleChange}
          name="firstName"
          id="firstName"
          label="First Name"
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.speciality}
          onChange={handleChange}
          name="speciality"
          id="speciality"
          label="Speciality"
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.licence_nbr}
          onChange={handleChange}
          name="licence_nbr"
          id="licence_nbr"
          label="CPSO#"
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.ohip_billing_nbr}
          onChange={handleChange}
          name="ohip_billing_nbr"
          id="ohip_billing_nbr"
          label="OHIP#"
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.line1}
          onChange={handleChange}
          name="line1"
          id="line1"
          label="Address"
        />
      </div>
      <div className="doctor-fax__form-row">
        <Input
          value={formDatas.city}
          onChange={handleChange}
          name="city"
          id="city"
          label="City"
        />
      </div>
      <div className="doctor-fax__form-row">
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
          label="Province/State"
        />
      </div>
      <div className="doctor-fax__form-row doctor-fax__form-row--postal">
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
      <div className="doctor-fax__form-row">
        <InputTel
          value={formDatas.phone}
          onChange={handleChange}
          name="phone"
          id="phone"
          label="Phone"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="doctor-fax__form-row">
        <InputTel
          value={formDatas.fax}
          onChange={handleChange}
          name="fax"
          id="fax"
          label="Fax"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="doctor-fax__form-row">
        <InputEmail
          value={formDatas.email}
          onChange={handleChange}
          name="email"
          id="email"
          label="Email"
        />
      </div>
      <div className="doctor-fax__form-btns">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default DoctorFaxForm;
