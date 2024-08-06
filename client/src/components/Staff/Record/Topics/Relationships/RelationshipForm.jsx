import { useState } from "react";
import "react-widgets/scss/styles.scss";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { toInverseRelation } from "../../../../../utils/relationships/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/record/relationshipValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import InputWithLogoInTable from "../../../../UI/Inputs/InputWithLogoInTable";
import SignCellForm from "../../../../UI/Tables/SignCellForm";
import RelationshipList from "./RelationshipList";

const RelationshipForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
  patientSelected,
  setPatientSearchVisible,
}) => {
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    relationship: "",
    relation_infos: null,
  });

  const [progress, setProgress] = useState(false);

  const handleRelationshipChange = (value) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, relationship: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topicToPost = {
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
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    //Post the relationship
    topicPost.mutate(topicToPost);
    //Post the inverse relationship
    let inverseRelationToPost = {};
    inverseRelationToPost.patient_id = patientSelected.patient_id;
    const gender = patientSelected.Gender;
    inverseRelationToPost.relationship = toInverseRelation(
      formDatas.relationship,
      toCodeTableName(genderCT, gender)
    );
    inverseRelationToPost.relation_id = formDatas.patient_id;
    inverseRelationToPost.date_created = nowTZTimestamp();
    inverseRelationToPost.created_by_id = user.id;

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

  const handleCancel = (e) => {
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
            value={formDatas.relationship}
            handleChange={handleRelationshipChange}
          />
          <span>of</span>
        </div>
      </td>
      <td style={{ position: "relative" }}>
        <InputWithLogoInTable
          name="patient_id"
          value={toPatientName(patientSelected)}
          readOnly={true}
          onClick={() => setPatientSearchVisible(true)}
        />
      </td>
      <SignCellForm />
    </tr>
  );
};

export default RelationshipForm;
