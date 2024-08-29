import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { CareElementType } from "../../../../../types/api";

type CareElementAdditionalHistoryEditProps = {
  datas: CareElementType;
  lastAdditionalData: {
    Data: {
      Value: string;
      Date: number;
    };
    Name: string;
    Unit: string;
  };
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CareElementAdditionalHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
  lastAdditionalData,
}: CareElementAdditionalHistoryEditProps) => {
  return <div></div>;
};

export default CareElementAdditionalHistoryEdit;
