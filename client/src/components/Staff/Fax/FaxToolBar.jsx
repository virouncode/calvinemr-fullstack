import { useFaxesDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import { dateStringToISO } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";

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
}) => {
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
      const faxesToDelete = {
        faxFileNames: faxesSelectedIds,
        direction: section === "Received faxes" ? "IN" : "OUT",
      };
      faxesDelete.mutate(faxesToDelete, {});
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_start") {
      if (value === "") {
        value = "19700101";
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

  const handleCheckAll = (e) => {
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
    <div className="fax-toolbar">
      <p className="fax-toolbar__title">Faxing</p>
      <div className="fax-toolbar__filter">
        <Input
          value={search}
          onChange={handleChange}
          id="search"
          placeholder="Search by fax number..."
          className="fax-toolbar__filter-search"
        />
        <div className="fax-toolbar__filter-date">
          <div className="fax-toolbar__filter-date-item">
            <InputDate
              value={dateStringToISO(rangeStart)}
              onChange={handleDateChange}
              id="from"
              label="From"
              disabled={all}
              name="date_start"
            />
          </div>
          <div className="fax-toolbar__filter-date-item">
            <InputDate
              value={dateStringToISO(rangeEnd)}
              onChange={handleDateChange}
              id="to"
              label="To"
              disabled={all}
              name="date_end"
            />
          </div>
          <div className="fax-toolbar__filter-date-item">
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

      <div className="fax-toolbar__btns">
        <Button onClick={handleClickNew} label="New" disabled={newVisible} />
        {currentFaxId === 0 && faxesSelectedIds.length !== 0 && (
          <Button onClick={handleDeleteSelected} label="Delete Selected" />
        )}
        {currentFaxId === 0 &&
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
