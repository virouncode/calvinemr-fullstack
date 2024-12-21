import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import NewWindow from "react-new-window";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  CycleType,
  DemographicsType,
  XanoPaginatedType,
} from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CycleDetails from "./CycleDetails";
import CycleForm from "./CycleForm";
import CycleItem from "./CycleItem";
import CyclePrint from "./CyclePrint";

type CyclesPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<CycleType>, unknown> | undefined;
  topicPost: UseMutationResult<CycleType, Error, Partial<CycleType>, void>;
  topicPut: UseMutationResult<CycleType, Error, CycleType, void>;
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
      InfiniteData<XanoPaginatedType<CycleType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
};

const CyclesPopUp = ({
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
  demographicsInfos,
}: CyclesPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [cycleToShow, setCycleToShow] = useState<CycleType | undefined>();
  const [show, setShow] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [printVisible, setPrintVisible] = useState(false);

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

  const handleAdd = () => {
    setErrMsgPost("");
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <div className="cycles">
        <h1 className="cycles__title">Cycle monitoring</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="cycles">
        <h1 className="cycles__title">Cycle monitoring</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="cycles">
      <h1 className="cycles__title">Cycle monitoring</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="cycles__table-container" ref={divRef}>
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
                      errMsgPost={errMsgPost}
                      lastItemRef={lastItemRef}
                      setCycleToShow={setCycleToShow}
                      setShow={setShow}
                      setPrintVisible={setPrintVisible}
                      topicDelete={topicDelete}
                    />
                  ) : (
                    <CycleItem
                      item={item}
                      key={item.id}
                      errMsgPost={errMsgPost}
                      setCycleToShow={setCycleToShow}
                      setShow={setShow}
                      setPrintVisible={setPrintVisible}
                      topicDelete={topicDelete}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan={7} text="No cycles" />}
            {isFetchingNextPage && <LoadingRow colSpan={7} />}
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
          width={window.innerWidth}
          height={800}
          x={0}
          y={(window.innerHeight - 800) / 2}
          color="#2B8C99"
          setPopUpVisible={setAddVisible}
          closeCross={false}
        >
          <CycleForm
            setAddVisible={setAddVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {show && cycleToShow && (
        <FakeWindow
          title={`ART CYCLE# ${cycleToShow?.cycle_nbr} DETAILS`}
          width={window.innerWidth}
          height={800}
          x={0}
          y={(window.innerHeight - 800) / 2}
          color="#2B8C99"
          setPopUpVisible={setShow}
          closeCross={false}
        >
          <CycleDetails
            setShow={setShow}
            cycleToShow={cycleToShow}
            demographicsInfos={demographicsInfos}
            topicPut={topicPut}
            patientId={patientId}
          />
        </FakeWindow>
      )}
      {printVisible && cycleToShow && (
        <NewWindow
          title={`ART Cycle: ${cycleToShow?.cycle_nbr}`}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 870,
            height: 1060,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPrintVisible(false)}
        >
          <CyclePrint cycle={cycleToShow} patientInfos={demographicsInfos} />
        </NewWindow>
      )}
    </div>
  );
};

export default CyclesPopUp;
