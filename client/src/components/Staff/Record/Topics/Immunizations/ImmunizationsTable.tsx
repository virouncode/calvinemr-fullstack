import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { ImmunizationType, XanoPaginatedType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import ImmunizationForm from "./ImmunizationForm";
import ImmunizationItem from "./ImmunizationItem";

type ImmunizationsTableProps = {
  datas: ImmunizationType[];
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  patientId: number;
  editCounter: React.MutableRefObject<number>;
  topicPost: UseMutationResult<
    ImmunizationType,
    Error,
    Partial<ImmunizationType>,
    void
  >;
  topicPut: UseMutationResult<ImmunizationType, Error, ImmunizationType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ImmunizationType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const ImmunizationsTable = ({
  datas,
  errMsgPost,
  setErrMsgPost,
  patientId,
  editCounter,
  topicPost,
  topicPut,
  topicDelete,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}: ImmunizationsTableProps) => {
  const [addVisible, setAddVisible] = useState(false);
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };
  return (
    <>
      <div className="immunizations__table-container" ref={rootRef}>
        <table className="immunizations__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Immunization type</th>
              <th>Immunization brand name</th>
              <th>Manufacturer</th>
              <th>Lot#</th>
              <th>Route</th>
              <th>Site</th>
              <th>Dose</th>
              <th>Date</th>
              <th>Refused</th>
              <th>Instructions</th>
              <th>Notes</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <ImmunizationForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                patientId={patientId}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                topicPost={topicPost}
              />
            )}
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <ImmunizationItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      targetRef={targetRef}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  ) : (
                    <ImmunizationItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan={14} text="No alerts" />}
            {isFetchingNextPage && <LoadingRow colSpan={14} />}
          </tbody>
        </table>
      </div>
      <div className="immunizations__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
      </div>
    </>
  );
};

export default ImmunizationsTable;
