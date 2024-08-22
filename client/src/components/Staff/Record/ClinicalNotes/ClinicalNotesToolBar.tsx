import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useUserContext from "../../../../hooks/context/useUserContext";
import { ClinicalNoteType, XanoPaginatedType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Button from "../../../UI/Buttons/Button";
import Input from "../../../UI/Inputs/Input";
import ClinicalNotesNavigation from "./ClinicalNotesNavigation";
import OrderPicker from "./OrderPicker";

type ClinicalNotesToolBarProps = {
  contentsVisible: boolean;
  setContentsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  addVisible: boolean;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triangleRef: React.MutableRefObject<SVGSVGElement | null>;
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
  topRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
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
  setNotesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  clinicalNotes: ClinicalNoteType[];
};

const ClinicalNotesToolBar = ({
  contentsVisible,
  setContentsVisible,
  addVisible,
  setAddVisible,
  search,
  setSearch,
  contentRef,
  triangleRef,
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
  setNotesVisible,
  clinicalNotes,
}: ClinicalNotesToolBarProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };

  //Events
  const handleClickOverview = () => {
    setOverviewVisible(true);
  };
  const handleClickSelectAll = async () => {
    if (selectAll) {
      setSelectAll(false);
      setCheckedNotesIds([]);
    } else {
      checkAllNotes();
      setSelectAll(true);
    }
  };
  const handleClickNew = async () => {
    //If most recent on bottom, we want all the clinical notes to put the form under
    if (order === "asc") {
      let hasMore = true;
      while (hasMore) {
        const { hasNextPage: hasNext } = await fetchNextPage();
        hasMore = hasNext ?? false;
      }
    }
    //Unfold the content
    if (contentRef.current && triangleRef.current) {
      triangleRef.current.classList.add("triangle--active");
      contentRef.current.classList.add("clinical-notes__content--active");
      setNotesVisible(true);
    }
    setAddVisible(true);
  };
  const handleClickFold = () => {
    if (!contentsVisible) {
      if (triangleRef.current)
        triangleRef.current.classList.add("triangle--active");
      if (contentRef.current)
        contentRef.current.classList.add("clinical-notes__content--active");
    }
    setContentsVisible((v) => !v);
  };
  const handleClickPrint = () => {
    setPrintVisible((v) => !v);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (
      triangleRef?.current &&
      !triangleRef.current.classList.contains("triangle--active")
    ) {
      triangleRef.current.classList.add("triangle--active");
    }
    if (
      contentRef?.current &&
      !contentRef.current.classList.contains("clinical-notes__content--active")
    ) {
      contentRef.current.classList.add("clinical-notes__content--active");
    }
  };

  const handleChangeOrder = async () => {
    if (addVisible) return;
    let newOrder;
    if (order === "asc") {
      setOrder("desc");
      newOrder = "desc";
    } else {
      setOrder("asc");
      newOrder = "asc";
    }
    //Change user settitngs
    try {
      const response = await xanoPut(`/settings/${user.settings.id}`, "staff", {
        ...user.settings,
        clinical_notes_order: newOrder,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, settings: response })
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to change order: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleGoToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView();
    }
    setGoToEnd(false);
  };
  const handleGoToEnd = async () => {
    let hasMore = true;
    while (hasMore) {
      const { hasNextPage: hasNext } = await fetchNextPage();
      hasMore = hasNext ?? false;
    }
    setGoToEnd(true);
    if (endRef.current) {
      endRef.current.scrollIntoView();
    }
  };

  return (
    <div className="clinical-notes__toolbar">
      <div className="clinical-notes__toolbar-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="search"
          placeholder="By content, author..."
          label="Search"
        />
      </div>
      <div className="clinical-notes__toolbar-order">
        <OrderPicker
          handleChangeOrder={handleChangeOrder}
          addVisible={addVisible}
          order={order}
        />
      </div>
      <div className="clinical-notes__toolbar-goto">
        <ClinicalNotesNavigation
          handleGoToTop={handleGoToTop}
          handleGoToEnd={handleGoToEnd}
        />
      </div>
      <div className="clinical-notes__toolbar-btn-container">
        <Button
          onClick={handleClickFold}
          label={contentsVisible ? "Fold" : "Unfold"}
        />
        <Button
          onClick={handleClickOverview}
          disabled={overviewVisible || isPending}
          label="Overview"
        />
        <Button
          onClick={handleClickNew}
          disabled={addVisible || newButtonDisabled || isPending}
          label="New"
        />
        <Button
          onClick={handleClickPrint}
          disabled={checkedNotesIds.length === 0 || isPending}
          label="Print Selection"
        />
        <Button
          onClick={handleClickSelectAll}
          disabled={isPending || !clinicalNotes.length}
          label={selectAll ? "Unselect All" : "Select All"}
        />
      </div>
    </div>
  );
};

export default ClinicalNotesToolBar;
