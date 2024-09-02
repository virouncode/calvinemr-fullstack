import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import {
  ClinicalNoteType,
  DemographicsType,
  XanoPaginatedType,
} from "../../../../types/api";
import ClinicalNotesTitle from "./ClinicalNotesTitle";
import ClinicalNotesToolBar from "./ClinicalNotesToolBar";

type ClinicalNotesHeaderProps = {
  demographicsInfos: DemographicsType;
  notesVisible: boolean;
  setNotesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentsVisible: boolean;
  setContentsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  triangleRef: React.MutableRefObject<SVGSVGElement | null>;
  addVisible: boolean;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  checkedNotesIds: number[];
  setCheckedNotesIds: React.Dispatch<React.SetStateAction<number[]>>;
  checkAllNotes: () => void;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  order: "asc" | "desc";
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  overviewVisible: boolean;
  setOverviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  newButtonDisabled: boolean;
  topRef: React.MutableRefObject<HTMLDivElement | null>;
  endRef: React.MutableRefObject<HTMLDivElement | null>;
  setGoToEnd: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ClinicalNoteType>, unknown>,
      Error
    >
  >;
  setNewMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
  clinicalNotes: ClinicalNoteType[];
};

const ClinicalNotesHeader = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentsVisible,
  setContentsVisible,
  contentRef,
  triangleRef,
  addVisible,
  setAddVisible,
  search,
  setSearch,
  checkedNotesIds,
  setCheckedNotesIds,
  checkAllNotes,
  setPrintVisible,
  selectAll,
  setSelectAll,
  order,
  setOrder,
  overviewVisible,
  setOverviewVisible,
  newButtonDisabled,
  topRef,
  endRef,
  setGoToEnd,
  isPending,
  fetchNextPage,
  setNewMessageVisible,
  clinicalNotes,
}: ClinicalNotesHeaderProps) => {
  return (
    <div className="clinical-notes__header">
      <ClinicalNotesTitle
        demographicsInfos={demographicsInfos}
        notesVisible={notesVisible}
        setNotesVisible={setNotesVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        setNewMessageVisible={setNewMessageVisible}
      />
      <ClinicalNotesToolBar
        contentsVisible={contentsVisible}
        setContentsVisible={setContentsVisible}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        setSearch={setSearch}
        contentRef={contentRef}
        triangleRef={triangleRef}
        checkedNotesIds={checkedNotesIds}
        setCheckedNotesIds={setCheckedNotesIds}
        checkAllNotes={checkAllNotes}
        setPrintVisible={setPrintVisible}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        order={order}
        setOrder={setOrder}
        overviewVisible={overviewVisible}
        setOverviewVisible={setOverviewVisible}
        newButtonDisabled={newButtonDisabled}
        topRef={topRef}
        endRef={endRef}
        setGoToEnd={setGoToEnd}
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        setNotesVisible={setNotesVisible}
        clinicalNotes={clinicalNotes}
      />
    </div>
  );
};

export default ClinicalNotesHeader;
