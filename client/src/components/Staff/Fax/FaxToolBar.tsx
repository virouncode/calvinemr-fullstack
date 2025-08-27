import { default as React } from "react";
import {
  useFaxesDelete,
  useMarkFaxesAs,
} from "../../../hooks/reactquery/mutations/faxMutations";
import {
  FaxesToDeleteType,
  FaxInboxType,
  FaxOutboxType,
} from "../../../types/api";
import { dateStringToISO } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import HeartIcon from "../../UI/Icons/HeartIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import { FAXES_PER_PAGE } from "./Faxes";

type FaxToolBarProps = {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  section: string;
  faxesSelectedIds: string[];
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  currentFaxId: string;
  faxes: FaxInboxType[] | FaxOutboxType[];
  selectAllVisible: boolean;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
  rangeStart: string;
  initialRangeStart: React.MutableRefObject<string>;
  rangeEnd: string;
  initialRangeEnd: React.MutableRefObject<string>;
  setRangeStart: React.Dispatch<React.SetStateAction<string>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  all: boolean;
  setAll: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  numberOfFaxes?: number;
  totalPages: number;
  setFolderFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FaxToolBar = ({
  newVisible,
  setNewVisible,
  section,
  faxesSelectedIds,
  setFaxesSelectedIds,
  currentFaxId,
  faxes,
  selectAllVisible,
  setSelectAllVisible,
  rangeStart,
  initialRangeStart,
  rangeEnd,
  initialRangeEnd,
  setRangeStart,
  setRangeEnd,
  search,
  setSearch,
  all,
  setAll,
  currentPage,
  setCurrentPage,
  numberOfFaxes,
  totalPages,
  setFolderFormVisible,
}: FaxToolBarProps) => {
  //Queries
  const faxesDelete = useFaxesDelete();
  const markFaxesAs = useMarkFaxesAs();

  const handleClickNew = () => {
    setNewVisible(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      const allFaxesIds = faxes.map(({ FileName }) => FileName);
      setFaxesSelectedIds(allFaxesIds);
      setSelectAllVisible(false);
    } else {
      setFaxesSelectedIds([]);
      setSelectAllVisible(true);
    }
  };

  const handleDeleteSelected = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete selected faxes ? (this action is irreversible and will remove them from all folders)`,
      })
    ) {
      const faxesToDelete: FaxesToDeleteType = {
        faxFileNames: faxesSelectedIds,
        direction: section === "Sent" ? "OUT" : "IN",
      };
      faxesDelete.mutate(faxesToDelete, {});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_start") {
      if (value === "") {
        value = "18000101";
      }
      initialRangeStart.current = value.split("-").join("");
      setRangeStart(value.split("-").join(""));
    }
    if (name === "date_end") {
      if (value === "") {
        value = "30000101";
      }
      initialRangeEnd.current = value.split("-").join("");
      setRangeEnd(value.split("-").join(""));
    }
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart("19700101");
      setRangeEnd("30000101");
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
    }
  };

  const handleMarkAsUnread = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to mark selected faxes as unread?",
      })
    ) {
      const fileNames = faxesSelectedIds;
      const viewedStatus = "N"; // Mark as unread
      markFaxesAs.mutate({ fileNames, viewedStatus });
    }
  };
  const handleMarkAsRead = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to mark selected faxes as read?",
      })
    ) {
      const fileNames = faxesSelectedIds;
      const viewedStatus = "Y"; // Mark as read
      markFaxesAs.mutate({ fileNames, viewedStatus });
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
  };

  const hasUnreadMessagesSelected =
    section === "Received faxes" &&
    faxes.some(
      (fax) =>
        faxesSelectedIds.includes(fax.FileName) &&
        (fax as FaxInboxType).ViewedStatus === "N"
    );

  const handleFolderFormVisible = () => {
    setFolderFormVisible(true);
  };

  return (
    <div className="fax__toolbar">
      <div className="fax__toolbar-title">
        <p>Faxing</p>
        <Button onClick={handleClickNew} label="New" disabled={newVisible} />
      </div>

      <div className="fax__toolbar-filter">
        <Input
          value={search}
          onChange={handleChange}
          id="search"
          placeholder="Search by fax number, contact name..."
          className="fax__toolbar-filter-search"
        />
        <div className="fax__toolbar-filter-date">
          <div className="fax__toolbar-filter-date-item">
            <InputDate
              value={dateStringToISO(rangeStart)}
              onChange={handleDateChange}
              id="from"
              label="From"
              disabled={all}
              name="date_start"
            />
          </div>
          <div className="fax__toolbar-filter-date-item">
            <InputDate
              value={dateStringToISO(rangeEnd)}
              onChange={handleDateChange}
              id="to"
              label="To"
              disabled={all}
              name="date_end"
            />
          </div>
          <div className="fax__toolbar-filter-date-item">
            <Checkbox
              id="all"
              name="all"
              onChange={handleCheckAll}
              checked={all}
              label="All"
            />
          </div>
        </div>
      </div>
      {numberOfFaxes ? (
        <div className="fax__toolbar-pagination">
          <p className="fax__toolbar-pagination-text">
            Page {currentPage} / {Math.ceil(numberOfFaxes / FAXES_PER_PAGE)}
          </p>
          <Button
            onClick={handlePreviousPage}
            label="<"
            disabled={currentPage === 1}
          />
          <Button
            onClick={handleNextPage}
            label=">"
            disabled={currentPage === totalPages}
          />
        </div>
      ) : null}

      <div className="fax__toolbar-btns">
        {currentFaxId === "" &&
          faxesSelectedIds.length !== 0 &&
          !hasUnreadMessagesSelected && (
            <Button onClick={handleMarkAsUnread} label="Mark as Unread" />
          )}
        {currentFaxId === "" &&
          faxesSelectedIds.length !== 0 &&
          hasUnreadMessagesSelected && (
            <Button onClick={handleMarkAsRead} label="Mark as Read" />
          )}
        {currentFaxId === "" &&
          faxesSelectedIds.length !== 0 &&
          section !== "Sent" && (
            <HeartIcon
              onClick={handleFolderFormVisible}
              ml={10}
              active={true}
              color="black"
            />
          )}
        {currentFaxId === "" && faxesSelectedIds.length !== 0 && (
          // import.meta.env.VITE_ISDEMO === "false" &&
          <TrashIcon onClick={handleDeleteSelected} ml={10} />
        )}
        {currentFaxId === "" && faxes.length > 0 && (
          <Checkbox checked={!selectAllVisible} onChange={handleSelectAll} />
        )}
      </div>
    </div>
  );
};

export default FaxToolBar;
