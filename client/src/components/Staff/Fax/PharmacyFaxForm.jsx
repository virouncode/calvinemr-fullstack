import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useTopicPost } from "../../../hooks/reactquery/mutations/topicMutations";
import { provinceStateTerritoryCT } from "../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../validation/record/pharmacyValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import GenericList from "../../UI/Lists/GenericList";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

const PharmacyFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}) => {
  const { user } = useUserContext();
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
  const topicPost = useTopicPost("PHARMACIES", 0);

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
      await pharmacySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const topicToPost = {
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
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          type="text"
          value={formDatas.name}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <label htmlFor="line1">Address:</label>
        <input
          name="line1"
          type="text"
          value={formDatas.line1}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <label htmlFor="city">City:</label>
        <input
          name="city"
          type="text"
          value={formDatas.city}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <label htmlFor="province">Province/State:</label>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
        />
      </div>
      <div className="pharmacy-fax__form-row pharmacy-fax__form-row--postal">
        <label htmlFor="postalOrZp">Postal/Zip code:</label>
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
      <div className="pharmacy-fax__form-row">
        <label htmlFor="phone">Phone:</label>
        <input
          name="phone"
          type="text"
          value={formDatas.phone}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <label htmlFor="fax">Fax:</label>
        <input
          name="fax"
          type="text"
          value={formDatas.fax}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="pharmacy-fax__form-row">
        <label htmlFor="fax">Email:</label>
        <input
          name="email"
          type="text"
          value={formDatas.email}
          onChange={handleChange}
          autoComplete="off"
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
