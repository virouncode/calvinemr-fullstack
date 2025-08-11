import React from "react";
import { useFaxesDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import {
  FaxesToDeleteType,
  FaxInboxType,
  FaxOutboxType,
} from "../../../types/api";
import { dateStringToISO } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";

type FaxToolBarProps = {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  section: string;
  faxesSelectedIds: string[];
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  currentFaxId: string;
  faxesInbox: FaxInboxType[];
  faxesOutbox: FaxOutboxType[];
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
};

const FaxToolBar = ({
  newVisible,
  setNewVisible,
  section,
  faxesSelectedIds,
  setFaxesSelectedIds,
  currentFaxId,
  faxesInbox,
  faxesOutbox,
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
}: FaxToolBarProps) => {
  //Queries
  const faxesDelete = useFaxesDelete();

  const handleClickNew = () => {
    setNewVisible(true);
  };

  const handleSelectAll = () => {
    const allFaxesIds =
      section === "Received faxes"
        ? faxesInbox.map(({ FileName }) => FileName)
        : faxesOutbox.map(({ FileName }) => FileName);
    setFaxesSelectedIds(allFaxesIds);
    setSelectAllVisible(false);
  };

  const handleUnselectAll = () => {
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleDeleteSelected = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete selected faxes ? (this action is irreversible)`,
      })
    ) {
      const faxesToDelete: FaxesToDeleteType = {
        faxFileNames: faxesSelectedIds,
        direction: section === "Received faxes" ? "IN" : "OUT",
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

  return (
    <div className="fax__toolbar">
      <p className="fax__toolbar-title">Faxing</p>
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

      <div className="fax__toolbar-btns">
        <Button onClick={handleClickNew} label="New" disabled={newVisible} />
        {currentFaxId === "" &&
          faxesSelectedIds.length !== 0 &&
          import.meta.env.VITE_ISDEMO === "false" && (
            <Button onClick={handleDeleteSelected} label="Delete Selected" />
          )}
        {currentFaxId === "" &&
          (selectAllVisible ? (
            <Button
              onClick={handleSelectAll}
              label="Select All"
              disabled={!faxesInbox && !faxesOutbox}
            />
          ) : (
            <Button onClick={handleUnselectAll} label="Unselect All" />
          ))}
      </div>
    </div>
  );
};

export default FaxToolBar;
