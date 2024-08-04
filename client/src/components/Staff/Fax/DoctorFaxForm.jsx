import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useDoctorPost } from "../../../hooks/reactquery/mutations/doctorsMutations";
import { provinceStateTerritoryCT } from "../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { doctorSchema } from "../../../validation/record/doctorValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import GenericList from "../../UI/Lists/GenericList";

const DoctorFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}) => {
  const { user } = useUserContext();
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
  const doctorPost = useDoctorPost();

  const handleChange = (e) => {
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

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await doctorSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const doctorToPost = {
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
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formDatas.lastName}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formDatas.firstName}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="speciality">Speciality:</label>
        <input
          id="speciality"
          name="speciality"
          type="text"
          value={formDatas.speciality}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="licence_nbr">CPSO#:</label>
        <input
          id="licence_nbr"
          name="licence_nbr"
          type="text"
          value={formDatas.licence_nbr}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="ohip_billing_nbr">OHIP#:</label>
        <input
          id="ohip_billing_nbr"
          name="ohip_billing_nbr"
          type="text"
          value={formDatas.ohip_billing_nbr}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="line1">Address:</label>
        <input
          id="line1"
          name="line1"
          type="text"
          value={formDatas.line1}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="city">City:</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formDatas.city}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="province">Province/State:</label>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
        />
      </div>
      <div className="doctor-fax__form-row doctor-fax__form-row--postal">
        <label htmlFor="postalOrZip">Postal/Zip code:</label>
        <select
          style={{ width: "60px", marginRight: "10px" }}
          name="postalOrZip"
          id="postalOrZip"
          value={postalOrZip}
          onChange={handleChangePostalOrZip}
        >
          <option value="postal">Postal</option>
          <option value="zip">Zip</option>
        </select>
        <input
          name="postalZipCode"
          type="text"
          value={
            postalOrZip === "postal" ? formDatas.postalCode : formDatas.zipCode
          }
          onChange={handleChange}
          autoComplete="off"
          placeholder={
            postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
          }
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="phone">Phone:</label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={formDatas.phone}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="fax">Fax:</label>
        <input
          id="fax"
          name="fax"
          type="text"
          value={formDatas.fax}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="doctor-fax__form-row">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          value={formDatas.email}
          onChange={handleChange}
          autoComplete="off"
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
