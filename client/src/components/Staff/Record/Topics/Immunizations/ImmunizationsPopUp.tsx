import React, { useRef, useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ImmunizationsCaption from "./ImmunizationsCaption";
import ImmunizationsTable from "./ImmunizationsTable";
import RecImmunizationsTable from "./RecImmunizationsTable";

type ImmunizationsPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientDob: number;
};

const ImmunizationsPopUp = ({
  patientId,
  setPopUpVisible,
  patientDob,
}: ImmunizationsPopUpProps) => {
  //HOOKS
  const [errMsgPost, setErrMsgPost] = useState("");
  const editCounter = useRef(0);

  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("IMMUNIZATIONS", patientId);
  const topicPost = useTopicPost("IMMUNIZATIONS", patientId);
  const topicPut = useTopicPut("IMMUNIZATIONS", patientId);
  const topicDelete = useTopicDelete("IMMUNIZATIONS", patientId);

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
  const handleClickReference = () => {
    const docWindow = window.open(
      "https://www.canada.ca/en/public-health/services/publications/healthy-living/canadian-immunization-guide-part-1-key-immunization-information/page-13-recommended-immunization-schedules.html",
      "_blank",
      `resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=1000, left=0, top=0`
    );
    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };

  if (isPending) {
    return (
      <div className="immunizations">
        <h1 className="immunizations__title">
          Patient immunizations
          <CloseButton onClick={handleClose} />
        </h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="immunizations">
        <h1 className="immunizations__title">
          Patient immunizations <CloseButton onClick={handleClose} />
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="immunizations">
      <h1 className="immunizations__title">
        Patient immunizations
        <CloseButton onClick={handleClose} />
      </h1>
      <h2 className="immunizations__subtitle">
        Recommended
        <span
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: "blue",
            marginLeft: "5px",
            fontWeight: "normal",
          }}
          onClick={handleClickReference}
        >
          (Reference)
        </span>
      </h2>
      <RecImmunizationsTable
        patientDob={patientDob}
        datas={datas?.filter(({ recommended }) => recommended) ?? []}
        patientId={patientId}
        topicPost={topicPost}
        topicPut={topicPut}
        topicDelete={topicDelete}
      />
      <ImmunizationsCaption />
      <h2 className="immunizations__subtitle">Others</h2>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <ImmunizationsTable
        datas={
          datas
            ?.filter(({ recommended }) => !recommended)
            .sort((a, b) => b.date_created - a.date_created) ?? []
        }
        setErrMsgPost={setErrMsgPost}
        errMsgPost={errMsgPost}
        patientId={patientId}
        editCounter={editCounter}
        topicPost={topicPost}
        topicPut={topicPut}
        topicDelete={topicDelete}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
      />
    </div>
  );
};

export default ImmunizationsPopUp;
