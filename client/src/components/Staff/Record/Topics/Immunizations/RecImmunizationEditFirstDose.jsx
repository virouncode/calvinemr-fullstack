import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import FormRecImmunization from "./FormRecImmunization";

const RecImmunizationEditFirstDose = ({
  immunizationInfos,
  type,
  errMsgPost,
  setErrMsgPost,
  setEditVisible,
  immunizationInfosSecondDose,
  topicPut,
  topicDelete,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState(immunizationInfos);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleDelete = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to remove this immunization ? Be careful the second dose will deleted as well",
      })
    ) {
      if (immunizationInfosSecondDose) {
        setProgress(true);
        topicDelete.mutate(immunizationInfos.id);
        topicDelete.mutate(immunizationInfosSecondDose.id, {
          onSuccess: () => {
            setProgress(false);
            setEditVisible(false);
          },
          onError: () => {
            setProgress(false);
          },
        });
      } else {
        topicDelete.mutate(immunizationInfos.id, {
          onSuccess: () => {
            setProgress(false);
            setEditVisible(false);
          },
          onError: () => {
            setProgress(false);
          },
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      updates: [
        ...immunizationInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await immunizationSchema.validate(topicToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value },
      });
      return;
    }
    if (name === "Date") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };
  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: value,
    });
  };
  const handleSiteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Site: value,
    });
  };

  return (
    <FormRecImmunization
      formDatas={formDatas}
      errMsgPost={errMsgPost}
      type={type}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleRouteChange={handleRouteChange}
      handleSiteChange={handleSiteChange}
      handleCancel={handleCancel}
      handleDelete={handleDelete}
      progress={progress}
    />
  );
};

export default RecImmunizationEditFirstDose;
