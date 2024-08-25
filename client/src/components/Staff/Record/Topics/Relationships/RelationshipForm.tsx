import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import "react-widgets/scss/styles.scss";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { DemographicsType, RelationshipType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { toInverseRelation } from "../../../../../utils/relationships/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/record/relationshipValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import InputWithSearchInTable from "../../../../UI/Inputs/InputWithSearchInTable";
import FormSignCell from "../../../../UI/Tables/FormSignCell";
import RelationshipList from "./RelationshipList";

type RelationshipFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    RelationshipType,
    Error,
    Partial<RelationshipType>,
    void
  >;
  patientSelected: DemographicsType | undefined;
  setPatientSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const RelationshipForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
  patientSelected,
  setPatientSearchVisible,
}: RelationshipFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<RelationshipType>>({
    patient_id: patientId,
    relationship: "",
  });

  const [progress, setProgress] = useState(false);

  const handleRelationshipChange = (value: string) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, relationship: value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const topicToPost: Partial<RelationshipType> = {
      patient_id: patientId,
      relationship: formDatas?.relationship,
      relation_id: patientSelected?.patient_id,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await relationshipSchema.validate(topicToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    //Post the relationship
    topicPost.mutate(topicToPost);
    //Post the inverse relationship
    const gender = patientSelected?.Gender;
    const inverseRelationToPost: Partial<RelationshipType> = {
      patient_id: patientSelected?.patient_id,
      relationship: toInverseRelation(
        formDatas.relationship ?? "",
        toCodeTableName(genderCT, gender)
      ),
      relation_id: formDatas.patient_id,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    if (inverseRelationToPost.relationship !== "Undefined") {
      topicPost.mutate(inverseRelationToPost, {
        onSuccess: () => {
          editCounter.current -= 1;
          setAddVisible(false);
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="relationships-form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="relationships-form__btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <div className="relationships-form__relationship">
          <RelationshipList
            value={formDatas.relationship ?? ""}
            handleChange={handleRelationshipChange}
          />
          <span>of</span>
        </div>
      </td>
      <td style={{ position: "relative" }}>
        <InputWithSearchInTable
          name="patient_id"
          value={toPatientName(patientSelected)}
          readOnly={true}
          onClick={() => setPatientSearchVisible(true)}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default RelationshipForm;
