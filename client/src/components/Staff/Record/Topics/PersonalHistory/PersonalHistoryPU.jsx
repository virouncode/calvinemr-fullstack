import { useEffect, useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../../../utils/dates/updates";
import { getResidualInfo } from "../../../../../utils/migration/exports/getResidualInfo";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { personalHistorySchema } from "../../../../../validation/record/personalHistoryValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import PersonalHistoryForm from "./PersonalHistoryForm";

const PersonalHistoryPU = ({
  topicDatas,
  topicPost,
  topicPut,
  isPending,
  error,
  patientId,
  setPopUpVisible,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    if (
      topicDatas &&
      topicDatas.pages.flatMap((page) => page.items).length > 0
    ) {
      const datas = topicDatas.pages.flatMap((page) => page.items);
      setFormDatas({
        occupations: getResidualInfo("Occupations", datas[0]),
        income: getResidualInfo("Income", datas[0]),
        religion: getResidualInfo("Religion", datas[0]),
        sexual_orientation: getResidualInfo("SexualOrientation", datas[0]),
        special_diet: getResidualInfo("SpecialDiet", datas[0]),
        smoking: getResidualInfo("Smoking", datas[0]),
        alcohol: getResidualInfo("Alcohol", datas[0]),
        recreational_drugs: getResidualInfo("RecreationalDrugs", datas[0]),
      });
    }
  }, [topicDatas]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleClose = async () => {
    if (!editVisible) {
      setPopUpVisible(false);
    } else if (
      editVisible &&
      (await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      }))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    const datas = topicDatas.pages.flatMap((page) => page.items);
    setFormDatas({
      occupations: getResidualInfo("Occupations", datas[0]),
      income: getResidualInfo("Income", datas[0]),
      religion: getResidualInfo("Religion", datas[0]),
      sexual_orientation: getResidualInfo("SexualOrientation", datas[0]),
      special_diet: getResidualInfo("SpecialDiet", datas[0]),
      smoking: getResidualInfo("Smoking", datas[0]),
      alcohol: getResidualInfo("Alcohol", datas[0]),
      recreational_drugs: getResidualInfo("RecreationalDrugs", datas[0]),
    });
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatasForValidation = { ...formDatas };
    //Validation
    try {
      await personalHistorySchema.validate(formDatasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    const datas = topicDatas.pages.flatMap((page) => page.items);
    //Formatting
    const topicToPut = {
      ...datas[0],
      ResidualInfo: {
        DataElement: [
          formDatas.occupations && {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.occupations),
          },
          formDatas.income && {
            Name: "Income",
            DataType: "text",
            Content: formDatas.income,
          },
          formDatas.religion && {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.religion),
          },
          formDatas.sexual_orientation && {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.sexual_orientation),
          },
          formDatas.special_diet && {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.special_diet),
          },
          formDatas.smoking && {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.smoking),
          },
          formDatas.alcohol && {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.alcohol),
          },
          formDatas.recreational_drugs && {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.recreational_drugs),
          },
        ].filter((element) => element),
      },
      updates: [
        ...datas[0].updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
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

  if (isPending) {
    return (
      <>
        <h1>Patient personal history</h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1>Patient personal history</h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }
  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="personalhistory-card">
        <div className="personalhistory-card__header">
          <h1>Patient personal history</h1>
        </div>
        {formDatas ? (
          <>
            <form className="personalhistory-form">
              {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Occupations:"
                  value={formDatas.occupations}
                  name="occupations"
                  onChange={handleChange}
                  id="occupations"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Income:"
                  value={formDatas.income}
                  name="income"
                  onChange={handleChange}
                  id="income"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Religion:"
                  value={formDatas.religion}
                  name="religion"
                  onChange={handleChange}
                  id="religion"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Sexual orientation:"
                  value={formDatas.sexual_orientation}
                  name="sexual_orientation"
                  onChange={handleChange}
                  id="sexual"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Special diet:"
                  value={formDatas.special_diet}
                  name="special_diet"
                  onChange={handleChange}
                  id="diet"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Smoking:"
                  value={formDatas.smoking}
                  name="smoking"
                  onChange={handleChange}
                  id="smoking"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Alcohol:"
                  value={formDatas.alcohol}
                  name="alcohol"
                  onChange={handleChange}
                  id="alcohol"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-form__row">
                <InputTextToggle
                  label="Recreational drugs:"
                  value={formDatas.recreational_drugs}
                  name="recreational_drugs"
                  onChange={handleChange}
                  id="drugs"
                  editVisible={editVisible}
                />
              </div>
              <div className="personalhistory-card__btns">
                {!editVisible ? (
                  <>
                    <EditButton
                      onClick={() => setEditVisible((v) => !v)}
                      disabled={progress}
                    />
                    <CloseButton onClick={handleClose} disabled={progress} />
                  </>
                ) : (
                  <>
                    <SaveButton onClick={handleSubmit} disabled={progress} />
                    <CancelButton onClick={handleCancel} disabled={progress} />
                  </>
                )}
              </div>
            </form>
            <p className="personalhistory-card__sign">
              {isUpdated(datas[0]) ? (
                <em>
                  Updated by{" "}
                  {staffIdToTitleAndName(
                    staffInfos,
                    getLastUpdate(datas[0]).updated_by_id
                  )}{" "}
                  on{" "}
                  {timestampToDateTimeSecondsStrTZ(
                    getLastUpdate(datas[0]).date_updated
                  )}
                </em>
              ) : (
                <em>
                  Created by{" "}
                  {staffIdToTitleAndName(staffInfos, datas[0].created_by_id)} on{" "}
                  {timestampToDateTimeSecondsStrTZ(datas[0].date_created)}
                </em>
              )}
            </p>
          </>
        ) : (
          <PersonalHistoryForm
            setPopUpVisible={setPopUpVisible}
            patientId={patientId}
            topicPost={topicPost}
          />
        )}
      </div>
    </>
  );
};

export default PersonalHistoryPU;
