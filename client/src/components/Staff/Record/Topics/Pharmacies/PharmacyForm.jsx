import { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../../../omdDatas/codesTables";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../../../validation/record/pharmacyValidation";
import GenericList from "../../../../UI/Lists/GenericList";

const PharmacyFaxForm = ({
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
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
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="pharmacies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="pharmacies__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <input
          name="name"
          type="text"
          value={formDatas.name}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="line1"
          type="text"
          value={formDatas.line1}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="city"
          type="text"
          value={formDatas.city}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
          handleChange={handleChange}
          noneOption={false}
        />
      </td>
      <td className="td--postal">
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
      </td>
      <td>
        <input
          name="phone"
          type="text"
          value={formDatas.phone}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </td>
      <td>
        <input
          name="fax"
          type="text"
          value={formDatas.fax}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </td>
      <td>
        <input
          name="email"
          type="text"
          value={formDatas.email}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default PharmacyFaxForm;
