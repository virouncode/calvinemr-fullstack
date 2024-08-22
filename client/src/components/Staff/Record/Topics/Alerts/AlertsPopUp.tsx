import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { AlertType, XanoPaginatedType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import AlertForm from "./AlertForm";
import AlertItem from "./AlertItem";

type AlertsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<AlertType>> | undefined;
  topicPost: UseMutationResult<AlertType, Error, Partial<AlertType>, void>;
  topicPut: UseMutationResult<AlertType, Error, AlertType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<AlertType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const AlertsPopUp = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}: AlertsPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  //HANDLERS
  const handleClose = async () => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <>
        <h1 className="alerts__title">Alerts and special needs</h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="alerts__title">Alerts and special needs</h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="alerts__title">Alerts and special needs</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="alerts__table-container" ref={divRef}>
          <table className="alerts__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Notes</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <AlertForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                  topicPost={topicPost}
                />
              )}
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <AlertItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    ) : (
                      <AlertItem
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
                  !addVisible && <EmptyRow colSpan={7} text="No alerts" />}
              {isFetchingNextPage && <LoadingRow colSpan={7} />}
            </tbody>
          </table>
        </div>
        <div className="alerts__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
    </>
  );
};

export default AlertsPopUp;
