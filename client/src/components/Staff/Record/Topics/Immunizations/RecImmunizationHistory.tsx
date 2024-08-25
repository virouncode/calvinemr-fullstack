import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { routeCT } from "../../../../../omdDatas/codesTables";
import {
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEditMultiple from "./RecImmunizationEditMultiple";

type RecImmunizationHistoryProps = {
  immunizationInfos: ImmunizationType[];
  type: RecImmunizationTypeListType;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  topicPut: UseMutationResult<ImmunizationType, Error, ImmunizationType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const RecImmunizationHistory = ({
  immunizationInfos,
  type,
  errMsgPost,
  setErrMsgPost,
  topicPut,
  topicDelete,
}: RecImmunizationHistoryProps) => {
  //HOOKS
  const [editVisible, setEditVisible] = useState(false);
  const [selectedImmunizationId, setSelectedImmunizationId] = useState(0);

  //HANDLERS
  const handleEdit = (id: number) => {
    setSelectedImmunizationId(id);
    setEditVisible(true);
  };

  return (
    <div className="recimmunizations-history">
      {immunizationInfos.length ? (
        <div>
          <ul style={{ padding: "0", margin: "0", textAlign: "left" }}>
            {immunizationInfos
              .sort((a, b) => (a.Date as number) - (b.Date as number))
              .map((immunization) => (
                <li
                  key={immunization.id}
                  className="recimmunizations-history__item"
                  onClick={() => handleEdit(immunization.id)}
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
                immunizationInfos={
                  immunizationInfos.find(
                    ({ id }) => id === selectedImmunizationId
                  ) as ImmunizationType
                }
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
