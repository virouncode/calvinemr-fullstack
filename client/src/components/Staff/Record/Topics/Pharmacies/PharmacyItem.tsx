import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../../hooks/reactquery/mutations/patientsMutations";
import { provinceStateTerritoryCT } from "../../../../../omdDatas/codesTables";
import {
  DemographicsType,
  PharmacyFormType,
  PharmacyType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pharmacySchema } from "../../../../../validation/record/pharmacyValidation";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../../UI/Inputs/Input";
import InputEmailToggle from "../../../../UI/Inputs/InputEmailToggle";
import InputTelToggle from "../../../../UI/Inputs/InputTelToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type PharmacyItemProps = {
  item: PharmacyType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  demographicsInfos: DemographicsType;
  topicPut: UseMutationResult<PharmacyType, Error, PharmacyType, void>;
  patientId: number;
};

const PharmacyItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  demographicsInfos,
  topicPut,
  patientId,
}: PharmacyItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<PharmacyFormType | undefined>();
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setItemInfos({
          ...(itemInfos as PharmacyFormType),
          postalCode: value,
          zipCode: "",
        });
        return;
      } else {
        setItemInfos({
          ...(itemInfos as PharmacyFormType),
          postalCode: "",
          zipCode: value,
        });
        return;
      }
    }
    setItemInfos({ ...(itemInfos as PharmacyFormType), [name]: value });
  };

  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setItemInfos({
      ...(itemInfos as PharmacyFormType),
      postalCode: "",
      zipCode: "",
    });
  };

  const handleSubmit = async () => {
    //Validation
    try {
      await pharmacySchema.validate(itemInfos);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const topicToPut: PharmacyType = {
      ...item,
      Name: firstLetterUpper(itemInfos?.name ?? ""),
      Address: {
        Structured: {
          Line1: firstLetterUpper(itemInfos?.line1 ?? ""),
          City: firstLetterUpper(itemInfos?.city ?? ""),
          CountrySubDivisionCode: itemInfos?.province ?? "",
          PostalZipCode: {
            PostalCode: itemInfos?.postalCode ?? "",
            ZipCode: itemInfos?.zipCode ?? "",
          },
        },
        _addressType: "M",
      },
      PhoneNumber: [
        {
          phoneNumber: itemInfos?.phone ?? "",
          _phoneNumberType: "W",
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: itemInfos?.fax ?? "",
      },
      EmailAddress: itemInfos?.email.toLowerCase() ?? "",
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    if (
      await confirmAlert({
        content: `You're about to update ${itemInfos?.name} infos, proceed ?`,
      })
    ) {
      //Submission
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSuccess: () => {
          editCounter.current -= 1;
          setEditVisible(false);
        },
        onSettled: () => {
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

  const handleCancel = () => {
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
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
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
          <InputTextToggle
            name="name"
            value={itemInfos.name}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="line1"
            value={itemInfos.line1}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="city"
            value={itemInfos.city}
            onChange={handleChange}
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
            placeHolder="Select province..."
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
            name="phone"
            id="phone"
            value={itemInfos.phone}
            onChange={handleChange}
            placeholder="xxx-xxx-xxxx"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTelToggle
            name="fax"
            id="fax"
            value={itemInfos.fax}
            onChange={handleChange}
            placeholder="xxx-xxx-xxxx"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputEmailToggle
            id="email"
            name="email"
            value={itemInfos.email}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PharmacyItem;
