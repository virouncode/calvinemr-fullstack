import { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CycleDetails from "./CycleDetails";
import CycleForm from "./CycleForm";
import CycleItem from "./CycleItem";

const CyclesPU = ({
  topicDatas,
  topicPost,
  topicPut,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [cycleToShow, setCycleToShow] = useState({});
  const [show, setShow] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
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
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <>
        <h1 className="cycles__title">
          Cycle monitoring <i className="fa-solid fa-person-pregnant"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="cycles__title">
          Cycle monitoring <i className="fa-solid fa-person-pregnant"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="cycles__title">
        Cycle monitoring <i className="fa-solid fa-person-pregnant"></i>
      </h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="cycles__table-container" ref={rootRef}>
        <table className="cycles__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Status</th>
              <th>Cycle number</th>
              <th>Date (LMP)</th>
              <th>Cycle type</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <CycleItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      lastItemRef={lastItemRef}
                      topicPut={topicPut}
                      setCycleToShow={setCycleToShow}
                      setShow={setShow}
                    />
                  ) : (
                    <CycleItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      topicPut={topicPut}
                      setCycleToShow={setCycleToShow}
                      setShow={setShow}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan="7" text="No cycles" />}
            {isFetchingNextPage && <LoadingRow colSpan="7" />}
          </tbody>
        </table>
      </div>
      <div className="cycles__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
      {addVisible && (
        <FakeWindow
          title="ADD A NEW CYCLE MONITORING"
          width={1400}
          height={800}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#2B8C99"
          setPopUpVisible={setAddVisible}
          closeCross={false}
        >
          <CycleForm
            setAddVisible={setAddVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            setErrMsgPost={setErrMsgPost}
            errMsgPost={errMsgPost}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {show && (
        <FakeWindow
          title={`IVF CYCLE# ${cycleToShow.cycle_nbr} DETAILS`}
          width={1400}
          height={800}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#2B8C99"
          setPopUpVisible={setShow}
          closeCross={false}
        >
          <CycleDetails
            setShow={setShow}
            cycleToShow={cycleToShow}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            topicPut={topicPut}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default CyclesPU;
