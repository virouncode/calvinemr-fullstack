import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../../hooks/reactquery/mutations/patientsMutations";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../../../validation/record/pharmacyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const PharmacyItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  demographicsInfos,
  topicPut,
  patientId,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);
  const patientPut = usePatientPut(patientId);

  useEffect(() => {
    setItemInfos({
      name: item.Name || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber,
      fax: item.FaxNumber?.phoneNumber,
      email: item.EmailAddress,
    });
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setItemInfos({ ...itemInfos, postalCode: value, zipCode: "" });
        return;
      } else {
        setItemInfos({ ...itemInfos, postalCode: "", zipCode: value });
        return;
      }
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setItemInfos({
      ...itemInfos,
      postalCode: "",
      zipCode: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await pharmacySchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const topicToPut = {
      ...item,
      Name: firstLetterUpper(itemInfos.name),
      Address: {
        Structured: {
          Line1: firstLetterUpper(itemInfos.line1),
          City: firstLetterUpper(itemInfos.city),
          CountrySubDivisionCode: itemInfos.province,
          PostalZipCode: {
            PostalCode: itemInfos.postalCode,
            ZipCode: itemInfos.zipCode,
          },
        },
        _addressType: "M",
      },
      PhoneNumber: [
        {
          phoneNumber: itemInfos.phone,
          _phoneNumberType: "W",
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: itemInfos.fax,
      },
      EmailAddress: itemInfos.email.toLowerCase(),
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    if (
      await confirmAlert({
        content: `You're about to update ${itemInfos.name} infos, proceed ?`,
      })
    ) {
      //Submission
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSuccess: () => {
          editCounter.current -= 1;
          setEditVisible(false);
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
      if (topicToPut.id === demographicsInfos.PreferredPharmacy) {
        patientPut.mutate({
          ...demographicsInfos,
          preferred_pharmacy: topicToPut,
        });
      }
    }
  };

  const handlePrefer = async () => {
    if (
      await confirmAlert({
        content:
          "You are about to change the patient's preferred pharmacy, proceed ?",
      })
    ) {
      const newPatientDemographics = {
        ...demographicsInfos,
        PreferredPharmacy: item.id,
        preferred_pharmacy: item,
      };
      patientPut.mutate(newPatientDemographics);
    }
  };
  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEditVisible(false);
    setItemInfos({
      name: item.Name || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber,
      fax: item.FaxNumber?.phoneNumber,
      email: item.EmailAddress,
    });
  };

  return (
    itemInfos && (
      <tr
        className="pharmacies-list__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="pharmacies__item-btn-container">
            {!editVisible ? (
              <>
                <Button
                  onClick={handlePrefer}
                  disabled={
                    demographicsInfos.PreferredPharmacy === item.id || progress
                  }
                  label="Prefer"
                />
                <EditButton onClick={handleEditClick} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </td>
        <td>
          {editVisible ? (
            <input
              name="name"
              type="text"
              value={itemInfos.name}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="line1"
              type="text"
              value={itemInfos.line1}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.line1
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="city"
              type="text"
              value={itemInfos.city}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.city
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={provinceStateTerritoryCT}
              value={itemInfos.province}
              name="province"
              handleChange={handleChange}
              noneOption={false}
            />
          ) : (
            toCodeTableName(provinceStateTerritoryCT, itemInfos.province)
          )}
        </td>
        <td className="td--postal">
          {editVisible ? (
            <>
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
                  postalOrZip === "postal"
                    ? itemInfos.postalCode
                    : itemInfos.zipCode
                }
                onChange={handleChange}
                autoComplete="off"
                placeholder={
                  postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
                }
              />
            </>
          ) : postalOrZip === "postal" ? (
            itemInfos.postalCode
          ) : (
            itemInfos.zipCode
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="phone"
              type="text"
              value={itemInfos.phone}
              onChange={handleChange}
              autoComplete="off"
              placeholder="xxx-xxx-xxxx"
            />
          ) : (
            itemInfos.phone
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="fax"
              type="text"
              value={itemInfos.fax}
              onChange={handleChange}
              autoComplete="off"
              placeholder="xxx-xxx-xxxx"
            />
          ) : (
            itemInfos.fax
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="email"
              type="email"
              value={itemInfos.email}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.email
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PharmacyItem;
