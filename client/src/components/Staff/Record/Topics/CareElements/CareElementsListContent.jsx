
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { timestampToDateTimeSecondsStrTZ } from "../../../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../../../utils/dates/updates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import CareElementsBMI from "./CareElementsBMI";
import CareElementsBSA from "./CareElementsBSA";
import CareElementsDiastolic from "./CareElementsDiastolic";
import CareElementsHeight from "./CareElementsHeight";
import CareElementsHeightFeet from "./CareElementsHeightFeet";
import CareElementsPacks from "./CareElementsPacks";
import CareElementsSmoking from "./CareElementsSmoking";
import CareElementsSystolic from "./CareElementsSystolic";
import CareElementsWaist from "./CareElementsWaist";
import CareElementsWeight from "./CareElementsWeight";
import CareElementsWeightLbs from "./CareElementsWeightLbs";

const CareElementsListContent = ({
  careElementPut,
  datas,
  lastDatas,
  handleClickHistory,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <>
      <CareElementsSmoking
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsPacks
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWeight
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWeightLbs
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsHeight
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsHeightFeet
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsBMI
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsBSA
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWaist
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsSystolic
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsDiastolic
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <p className="care-elements__sign">
        {datas && isUpdated(datas) ? (
          <em>
            Updated by{" "}
            {staffIdToTitleAndName(
              staffInfos,
              getLastUpdate(datas).updated_by_id
            )}{" "}
            on{" "}
            {timestampToDateTimeSecondsStrTZ(getLastUpdate(datas).date_updated)}
          </em>
        ) : (
          datas && (
            <em>
              Created by{" "}
              {staffIdToTitleAndName(staffInfos, datas.created_by_id)} on{" "}
              {timestampToDateTimeSecondsStrTZ(datas.date_created)}
            </em>
          )
        )}
      </p>
    </>
  );
};

export default CareElementsListContent;
