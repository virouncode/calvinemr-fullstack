import React, { useRef, useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import AppointmentForm from "./AppointmentForm";
import AppointmentItem from "./AppointmentItem";

type AppointmentsPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppointmentsPopUp = ({
  patientId,
  setPopUpVisible,
}: AppointmentsPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  //Queries
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("APPOINTMENTS", patientId);
  const topicPost = useTopicPost("APPOINTMENTS", patientId);
  const topicPut = useTopicPut("APPOINTMENTS", patientId);
  const topicDelete = useTopicDelete("APPOINTMENTS", patientId);

  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

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

  const handleAdd = async () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPending || isPendingSites) {
    return (
      <div className="appointments">
        <h1 className="appointments__title">Patient appointments</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error || errorSites) {
    return (
      <div className="appointments">
        <h1 className="appointments__title">Patient appointments</h1>
        <ErrorParagraph
          errorMsg={error?.message || errorSites?.message || ""}
        />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="appointments">
      <h1 className="appointments__title">Patient appointments</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="appointments__table-container" ref={divRef}>
        <table className="appointments__table">
          <thead>
            <tr>
              {/* <th>Action</th> */}
              <th>Host</th>
              <th>Purpose</th>
              <th>Recurrence</th>
              <th>Until</th>
              <th>From</th>
              <th>To</th>
              <th>All Day</th>
              <th>Site</th>
              <th>Room</th>
              <th>Status</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <AppointmentForm
                patientId={patientId}
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                sites={sites}
                topicPost={topicPost}
              />
            )}
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <AppointmentItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      sites={sites}
                      lastItemRef={lastItemRef}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  ) : (
                    <AppointmentItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      sites={sites}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan={12} text="No appointments" />}
            {isFetchingNextPage && <LoadingRow colSpan={12} />}
          </tbody>
        </table>
      </div>
      <div className="appointments__btn-container">
        {/* <Button onClick={handleAdd} disabled={addVisible} label="Add" /> */}
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default AppointmentsPopUp;
