import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { doctorSchema } from "../../../../../validation/record/doctorValidation";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../../UI/Inputs/Input";
import InputEmail from "../../../../UI/Inputs/InputEmail";
import InputTelToggle from "../../../../UI/Inputs/InputTelToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCellMultipleTypes from "../../../../UI/Tables/SignCellMultipleTypes";

const FamilyDoctorListItem = ({
  item,
  editCounter,
  patientId,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  doctorPut,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos({
      firstName: item.FirstName || "",
      lastName: item.LastName || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode?.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode?.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber || "",
      fax: item.FaxNumber?.phoneNumber || "",
      email: item.EmailAddress || "",
      speciality: item.speciality || "",
      licence_nbr: item.licence_nbr,
      ohip_billing_nbr: item.ohip_billing_nbr,
      patients: item.patients,
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
      await doctorSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const doctorToPut = {
      ...item,
      FirstName: firstLetterUpper(itemInfos.firstName),
      LastName: firstLetterUpper(itemInfos.lastName),
      Address: {
        _addressType: "M",
        Structured: {
          Line1: firstLetterUpper(itemInfos.line1),
          City: firstLetterUpper(itemInfos.city),
          CountrySubDivisionCode: itemInfos.province,
          PostalZipCode: {
            PostalCode: itemInfos.postalCode,
            ZipCode: itemInfos.zipCode,
          },
        },
      },
      PhoneNumber: [
        {
          _phoneNumberType: "W",
          phoneNumber: itemInfos.phone,
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: itemInfos.fax,
      },
      EmailAddress: itemInfos.email.toLowerCase(),
      speciality: firstLetterUpper(itemInfos.speciality),
      licence_nbr: itemInfos.licence_nbr,
      ohip_billing_nbr: itemInfos.ohip_billing_nbr,
      updates: [
        ...item.updates,
        {
          updated_by_id: user.id,
          updated_by_user_type: "staff",
          date_updated: nowTZTimestamp(),
        },
      ],
    };

    if (
      await confirmAlert({
        content: `You're about to update Dr. ${itemInfos.firstName} ${itemInfos.lastName} infos, proceed ?`,
      })
    ) {
      //Submission
      setProgress(true);
      doctorPut.mutate(doctorToPut, {
        onSuccess: () => {
          editCounter.current -= 1;
          setEditVisible(false);
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleAddToPatient = async () => {
    const doctorToPut = {
      ...item,
      patients: [...item.patients, patientId],
      updates: [
        ...item.updates,
        {
          date_updated: nowTZTimestamp(),
          updated_by_id: user.id,
          updated_by_user_type: "staff",
        },
      ],
    };
    doctorPut.mutate(doctorToPut);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEditVisible(false);
    setItemInfos({
      firstName: item.FirstName || "",
      lastName: item.LastName || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode?.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode?.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber || "",
      fax: item.FaxNumber?.phoneNumber || "",
      email: item.EmailAddress || "",
      speciality: item.speciality || "",
      licence_nbr: item.licence_nbr,
      ohip_billing_nbr: item.ohip_billing_nbr,
      patients: item.patients,
    });
  };

  return (
    itemInfos && (
      <tr
        className="doctors__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="doctors__item-btn-container">
            {!editVisible ? (
              <>
                <Button
                  onClick={handleAddToPatient}
                  disabled={item.patients.includes(patientId) || progress}
                  label="Add to patient"
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
          <InputTextToggle
            value={itemInfos.lastName}
            onChange={handleChange}
            name="lastName"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.firstName}
            onChange={handleChange}
            name="firstName"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.speciality}
            onChange={handleChange}
            name="speciality"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.licence_nbr}
            onChange={handleChange}
            name="licence_nbr"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.ohip_billing_nbr}
            onChange={handleChange}
            name="ohip_billing_nbr"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.line1}
            onChange={handleChange}
            name="line1"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.city}
            onChange={handleChange}
            name="city"
            editVisible={editVisible}
          />
        </td>
        <td>
          <GenericListToggle
            list={provinceStateTerritoryCT}
            value={itemInfos.province}
            name="province"
            handleChange={handleChange}
            noneOption={false}
            editVisible={editVisible}
          />
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
              <Input
                name="postalZipCode"
                value={
                  postalOrZip === "postal"
                    ? itemInfos.postalCode
                    : itemInfos.zipCode
                }
                onChange={handleChange}
                placeholder={
                  postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
                }
              />
            </>
          ) : postalOrZip === "postal" ? (
            <p>{itemInfos.postalCode}</p>
          ) : (
            <p>{itemInfos.zipCode}</p>
          )}
        </td>
        <td>
          <InputTelToggle
            value={itemInfos.phone}
            onChange={handleChange}
            name="phone"
            editVisible={editVisible}
            placeholder="xxx-xxx-xxxx"
          />
        </td>
        <td>
          <InputTelToggle
            value={itemInfos.fax}
            onChange={handleChange}
            name="fax"
            editVisible={editVisible}
            placeholder="xxx-xxx-xxxx"
          />
        </td>
        <td>
          <InputEmail
            value={itemInfos.email}
            onChange={handleChange}
            name="email"
            editVisible={editVisible}
          />
        </td>
        <SignCellMultipleTypes item={item} />
      </tr>
    )
  );
};

export default FamilyDoctorListItem;
