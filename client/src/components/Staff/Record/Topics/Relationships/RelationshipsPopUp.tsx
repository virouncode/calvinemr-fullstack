import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { RelationshipType, XanoPaginatedType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import RelationshipForm from "./RelationshipForm";
import RelationshipItem from "./RelationshipItem";

type RelationshipsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<RelationshipType>> | undefined;
  topicPost: UseMutationResult<
    RelationshipType,
    Error,
    Partial<RelationshipType>,
    void
  >;
  topicPut: UseMutationResult<RelationshipType, Error, RelationshipType, void>;
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
      InfiniteData<XanoPaginatedType<RelationshipType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const RelationshipsPopUp = ({
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
}: RelationshipsPopUpProps) => {
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
      <div className="relationships">
        <h1 className="relationships__title">Patient relationships</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="relationships">
        <h1 className="relationships__title">Patient relationships</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="relationships">
      <h1 className="relationships__title">Patient relationships</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="relationships__table-container" ref={divRef}>
          <table className="relationships__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Relation</th>
                <th>With Patient</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <RelationshipForm
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
                      <RelationshipItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        topicPost={topicPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    ) : (
                      <RelationshipItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        topicPost={topicPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    )
                  )
                : !isFetchingNextPage &&
                  !addVisible && (
                    <EmptyRow colSpan={5} text="No relationships" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan={5} />}
            </tbody>
          </table>
        </div>
        <div className="relationships__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
    </div>
  );
};

export default RelationshipsPopUp;
