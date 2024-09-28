import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { PregnancyType, XanoPaginatedType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import PregnancyForm from "./PregnancyForm";
import PregnancyItem from "./PregnancyItem";

type PregnanciesPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<PregnancyType>> | undefined;
  topicPost: UseMutationResult<
    PregnancyType,
    Error,
    Partial<PregnancyType>,
    void
  >;
  topicPut: UseMutationResult<PregnancyType, Error, PregnancyType, void>;
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
      InfiniteData<XanoPaginatedType<PregnancyType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const PregnanciesPopUp = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  patientId,
  setPopUpVisible,
}: PregnanciesPopUpProps) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
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
      <div className="pregnancies">
        <h1 className="pregnancies__title">Patient pregnancies</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="pregnancies">
        <h1 className="pregnancies__title">Patient pregnancies</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="pregnancies">
      <h1 className="pregnancies__title">Patient pregnancies</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="pregnancies__table-container" ref={divRef}>
        <table className="pregnancies__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Description</th>
              <th>Date Of Event</th>
              <th>Premises</th>
              <th>Term</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <PregnancyForm
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
                    <PregnancyItem
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
                    <PregnancyItem
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
                !addVisible && <EmptyRow colSpan={8} text="No pregnancies" />}
            {isFetchingNextPage && <LoadingRow colSpan={8} />}
          </tbody>
        </table>
      </div>
      <div className="pregnancies__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default PregnanciesPopUp;
