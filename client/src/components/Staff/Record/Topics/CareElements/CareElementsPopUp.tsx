import { InfiniteData, UseMutationResult } from "@tanstack/react-query";
import React from "react";
import {
  CareElementAdditionalType,
  CareElementType,
  XanoPaginatedType,
} from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import CareElementsForm from "./CareElementsForm";
import CareElementsList from "./CareElementsList";

type CareElementsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<CareElementType>> | undefined;
  topicPost: UseMutationResult<
    CareElementType,
    Error,
    Partial<CareElementType>,
    void
  >;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  patientName: string;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CareElementsPopUp = ({
  topicDatas,
  topicPost,
  topicPut,
  isPending,
  error,
  patientId,
  patientName,
  setPopUpVisible,
}: CareElementsPopUpProps) => {
  if (isPending) {
    return (
      <div className="care-elements">
        <h1 className="care-elements__title">Patient care elements</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="care-elements">
        <h1 className="care-elements__title">Patient care elements</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages?.flatMap((page) => page.items)[0];

  const additionalDatas: CareElementAdditionalType[] = datas?.Additional ?? [];

  if (!datas) {
    return (
      <CareElementsForm
        careElementPost={topicPost}
        setPopUpVisible={setPopUpVisible}
        patientId={patientId}
      />
    );
  } else {
    return (
      <CareElementsList
        careElementPut={topicPut}
        setPopUpVisible={setPopUpVisible}
        datas={datas}
        additionalDatas={additionalDatas}
        patientName={patientName}
      />
    );
  }
};

export default CareElementsPopUp;
