import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { CareElementType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeetAndInches,
  feetAndInchesToCm,
  kgToLbs,
  lbsToKg,
} from "../../../../../../utils/measurements/measurements";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import CareElementEditItemMeasurements from "./CareElementEditItemMeasurements";

type CareElementEditMeasurementsProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementEditMeasurements = ({
  setEditVisible,
  careElementsDatas,
  topicPut,
}: CareElementEditMeasurementsProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatasKg, setFormDatasKg] = useState(
    careElementsDatas?.Weight.sort((a, b) => b.Date - a.Date)
  );
  const [formDatasLbs, setFormDatasLbs] = useState(
    careElementsDatas?.Weight.sort((a, b) => b.Date - a.Date).map((data) => ({
      ...data,
      Weight: kgToLbs(data.Weight),
      WeightUnit: "lbs" as const,
    }))
  );
  const [formDatasCm, setFormDatasCm] = useState(
    careElementsDatas?.Height.sort((a, b) => b.Date - a.Date)
  );
  const [formDatasFtIn, setFormDatasFtIn] = useState(
    careElementsDatas?.Height.sort((a, b) => b.Date - a.Date).map((data) => ({
      ...data,
      Height: cmToFeetAndInches(data.Height),
      HeightUnit: "ft in" as const,
    }))
  );
  const [formDatasBMI, setFormDatasBMI] = useState(
    careElementsDatas?.bodyMassIndex.sort((a, b) => b.Date - a.Date)
  );

  const [formDatasBSA, setFormDatasBSA] = useState(
    careElementsDatas?.bodySurfaceArea.sort((a, b) => b.Date - a.Date)
  );

  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,5})?$/;
    const regex2 = /^\s*\d{1,2}'\d{1,2}"?\s*$|^\s*\d{1,2}\s*$/;
    if (formDatasKg?.some((data) => !regex.test(data.Weight))) {
      setErrMsgPost(`Invalid Weight (kg) : Please enter a valid number.`);
      return;
    }
    if (formDatasLbs?.some((data) => !regex.test(data.Weight))) {
      setErrMsgPost(`Invalid Weight (lbs) : Please enter a valid number.`);
      return;
    }
    if (formDatasCm?.some((data) => !regex.test(data.Height))) {
      setErrMsgPost(`Invalid Height (cm) : Please enter a valid number.`);
      return;
    }
    if (formDatasFtIn?.some((data) => !regex2.test(data.Height))) {
      setErrMsgPost(
        `Invalid Height (ft in) : Please enter a valid format : ft'in" (5'7") or ft (5)`
      );
      return;
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      updates: [
        ...(careElementsDatas?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      Weight: formDatasKg as {
        Weight: string;
        Date: number;
        WeightUnit: "kg";
      }[],
      Height: formDatasCm as {
        Height: string;
        Date: number;
        HeightUnit: "cm";
      }[],
      bodyMassIndex: formDatasBMI as {
        BMI: string;
        Date: number;
      }[],
      bodySurfaceArea: formDatasBSA as {
        BSA: string;
        Date: number;
      }[],
    };

    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatasKg(
          formDatasKg?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        setFormDatasLbs(
          formDatasLbs?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        setFormDatasBMI(
          formDatasBMI?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        setFormDatasBSA(
          formDatasBSA?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        return;
      case "kg":
        setFormDatasKg(
          formDatasKg?.map((data, i) =>
            i === index ? { ...data, Weight: value } : data
          )
        );
        setFormDatasLbs(
          formDatasLbs?.map((data, i) =>
            i === index ? { ...data, Weight: kgToLbs(value) } : data
          )
        );
        setFormDatasBMI(
          formDatasBMI?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BMI: bodyMassIndex(formDatasCm?.[index].Height ?? "", value),
                }
              : data
          )
        );
        setFormDatasBSA(
          formDatasBSA?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BSA: bodySurfaceArea(
                    formDatasCm?.[index].Height ?? "",
                    value
                  ),
                }
              : data
          )
        );
        return;
      case "lbs":
        setFormDatasLbs(
          formDatasLbs?.map((data, i) =>
            i === index ? { ...data, Weight: value } : data
          )
        );
        setFormDatasKg(
          formDatasKg?.map((data, i) =>
            i === index ? { ...data, Weight: lbsToKg(value) } : data
          )
        );
        setFormDatasBMI(
          formDatasBMI?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BMI: bodyMassIndex(
                    formDatasCm?.[index].Height ?? "",
                    lbsToKg(value)
                  ),
                }
              : data
          )
        );
        setFormDatasBSA(
          formDatasBSA?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BSA: bodySurfaceArea(
                    formDatasCm?.[index].Height ?? "",
                    lbsToKg(value)
                  ),
                }
              : data
          )
        );
        return;
      case "cm":
        setFormDatasCm(
          formDatasCm?.map((data, i) =>
            i === index ? { ...data, Height: value } : data
          )
        );
        setFormDatasFtIn(
          formDatasFtIn?.map((data, i) =>
            i === index ? { ...data, Height: cmToFeetAndInches(value) } : data
          )
        );
        setFormDatasBMI(
          formDatasBMI?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BMI: bodyMassIndex(value, formDatasKg?.[index].Weight ?? ""),
                }
              : data
          )
        );
        setFormDatasBSA(
          formDatasBSA?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BSA: bodySurfaceArea(
                    value,
                    formDatasKg?.[index].Weight ?? ""
                  ),
                }
              : data
          )
        );
        return;
      case "ft in":
        setFormDatasFtIn(
          formDatasFtIn?.map((data, i) =>
            i === index ? { ...data, Height: value } : data
          )
        );
        setFormDatasCm(
          formDatasCm?.map((data, i) =>
            i === index ? { ...data, Height: feetAndInchesToCm(value) } : data
          )
        );
        setFormDatasBMI(
          formDatasBMI?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BMI: bodyMassIndex(
                    feetAndInchesToCm(value),
                    formDatasKg?.[index].Weight ?? ""
                  ),
                }
              : data
          )
        );
        setFormDatasBSA(
          formDatasBSA?.map((data, i) =>
            i === index
              ? {
                  ...data,
                  BSA: bodySurfaceArea(
                    feetAndInchesToCm(value),
                    formDatasKg?.[index].Weight ?? ""
                  ),
                }
              : data
          )
        );
        return;
    }
  };

  const handleRemove = (index: number) => {
    setFormDatasKg(formDatasKg?.filter((data, i) => i !== index));
    setFormDatasLbs(formDatasLbs?.filter((data, i) => i !== index));
    setFormDatasCm(formDatasCm?.filter((data, i) => i !== index));
    setFormDatasFtIn(formDatasFtIn?.filter((data, i) => i !== index));
    setFormDatasBMI(formDatasBMI?.filter((data, i) => i !== index));
    setFormDatasBSA(formDatasBSA?.filter((data, i) => i !== index));
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatasKg?.map((data, index) => (
          <CareElementEditItemMeasurements
            key={index}
            dataKg={data}
            dataLbs={formDatasLbs?.[index]}
            dataCm={formDatasCm?.[index]}
            dataFtIn={formDatasFtIn?.[index]}
            handleChange={handleChange}
            handleRemove={handleRemove}
            index={index}
          />
        ))}
      </div>
      <div className="care-elements__edit-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default CareElementEditMeasurements;
