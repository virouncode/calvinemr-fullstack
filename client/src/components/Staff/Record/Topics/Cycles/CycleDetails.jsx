import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import CycleCycleInfos from "./CycleCycleInfos";
import CycleEvents from "./CycleEvents";
import CycleNotes from "./CycleNotes";
import CyclePatientInfos from "./CyclePatientInfos";
import CycleSpermInfos from "./CycleSpermInfos";
import CycleTestsInfos from "./CycleTestsInfos";

const CycleDetails = ({
  cycleToShow,
  setShow,
  demographicsInfos,
  topicPut,
}) => {
  const { user } = useUserContext();
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [itemInfos, setItemInfos] = useState(null);
  useEffect(() => {
    setItemInfos({
      ...cycleToShow,
      cycle_nbr: cycleToShow.cycle_nbr.split("-")[3],
    });
  }, [cycleToShow]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await cycleSchema.validate(itemInfos);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    const cycleToPut = {
      ...itemInfos,
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      cycle_nbr: `${demographicsInfos.ChartNumber}-${itemInfos.cycle_nbr}`,
    };

    setProgress(true);
    topicPut.mutate(cycleToPut, {
      onSuccess: () => {
        setShow(false);
        setProgress(false);
      },
      onError: () => setProgress(false),
    });
  };
  const handleClose = async (e) => {
    e.preventDefault();
    if (
      await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      })
    ) {
      setShow(false);
    }
  };
  const handlePrint = (e) => {
    e.preventDefault();
  };
  return (
    itemInfos && (
      <form className="cycles-form">
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
        <CyclePatientInfos
          demographicsInfos={demographicsInfos}
          errMsg={errMsg}
        />
        <CycleSpermInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleCycleInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleTestsInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleEvents
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleNotes
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <div className="cycles-form__btn-container">
          <SaveButton onClick={handleSave} disabled={progress} />
          <PrintButton onClick={handlePrint} disabled={progress} />
          <CloseButton onClick={handleClose} disabled={progress} />
          {progress && <CircularProgressSmall />}
        </div>
      </form>
    )
  );
};

export default CycleDetails;
