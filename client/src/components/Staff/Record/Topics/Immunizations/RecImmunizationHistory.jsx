import { useState } from "react";
import { routeCT } from "../../../../../omdDatas/codesTables";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEditMultiple from "./RecImmunizationEditMultiple";

const RecImmunizationHistory = ({
  immunizationInfos,
  type,
  errMsgPost,
  setErrMsgPost,
  topicPut,
  topicDelete,
}) => {
  //HOOKS
  const [editVisible, setEditVisible] = useState(false);
  const [selectedImmunizationId, setSelectedImmunizationId] = useState("");

  //HANDLERS
  const handleEdit = (e, id) => {
    setSelectedImmunizationId(parseInt(id));
    setEditVisible(true);
  };

  return (
    <div className="recimmunizations-history">
      {immunizationInfos.length ? (
        <div>
          <ul style={{ padding: "0", margin: "0", textAlign: "left" }}>
            {immunizationInfos
              .sort((a, b) => a.Date - b.Date)
              .map((immunization) => (
                <li
                  key={immunization.id}
                  className="recimmunizations-history__item"
                  onClick={(e) => handleEdit(e, immunization.id)}
                >
                  {`${timestampToDateISOTZ(immunization.Date)}, `}
                  {immunization.ImmunizationName
                    ? `${immunization.ImmunizationName}, `
                    : null}
                  {immunization.Manufacturer
                    ? `${immunization.Manufacturer}, `
                    : null}
                  {immunization.LotNumber
                    ? `${immunization.LotNumber}, `
                    : null}
                  {immunization.Route
                    ? `${
                        routeCT.find(({ code }) => code === immunization.Route)
                          ?.name || immunization.Route
                      }, `
                    : null}
                </li>
              ))}
          </ul>
          {editVisible && (
            <FakeWindow
              title={`EDIT ${type} IMMUNIZATION`}
              width={700}
              height={650}
              x={(window.innerWidth - 700) / 2}
              y={(window.innerHeight - 650) / 2}
              color="#931621"
              setPopUpVisible={setEditVisible}
            >
              <RecImmunizationEditMultiple
                immunizationInfos={immunizationInfos.find(
                  ({ id }) => id === selectedImmunizationId
                )}
                type={type}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                setEditVisible={setEditVisible}
                topicPut={topicPut}
                topicDelete={topicDelete}
              />
            </FakeWindow>
          )}
        </div>
      ) : (
        <div>No vaccination history</div>
      )}
    </div>
  );
};

export default RecImmunizationHistory;
