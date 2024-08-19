import React, { useRef, useState } from "react";
import {
  useFaxesInbox,
  useFaxesOutbox,
} from "../../../hooks/reactquery/queries/faxQueries";
import useTitle from "../../../hooks/useTitle";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import FaxBox from "./FaxBox";
import FaxLeftBar from "./FaxLeftBar";
import FaxToolBar from "./FaxToolBar";

const Faxes = () => {
  const [newVisible, setNewVisible] = useState(false);
  const [faxesSelectedIds, setFaxesSelectedIds] = useState<string[]>([]);
  const [currentFaxId, setCurrentFaxId] = useState("");
  const [currentCallerId, setCurrentCallerId] = useState("");
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const [section, setSection] = useState("Received faxes");
  const [search, setSearch] = useState("");
  const [rangeStart, setRangeStart] = useState(
    timestampToDateISOTZ(getStartOfTheMonthTZ()).split("-").join("")
  ); //start of the month
  const [rangeEnd, setRangeEnd] = useState(
    timestampToDateISOTZ(getEndOfTheMonthTZ()).split("-").join("")
  ); //start of the month
  const [all, setAll] = useState(false);

  const initialRangeStart = useRef(
    timestampToDateISOTZ(getStartOfTheMonthTZ()).split("-").join("")
  );
  const initialRangeEnd = useRef(
    timestampToDateISOTZ(getEndOfTheMonthTZ()).split("-").join("")
  );

  const {
    data: faxesInbox,
    isPending: isPendingInbox,
    error: errorInbox,
  } = useFaxesInbox("ALL", all, rangeStart, rangeEnd);
  const {
    data: faxesOutbox,
    isPending: isPendingOutbox,
    error: errorOutbox,
  } = useFaxesOutbox(all, rangeStart, rangeEnd);

  useTitle("Fax");

  return (
    <div className="fax-container">
      <FaxToolBar
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        faxesSelectedIds={faxesSelectedIds}
        setFaxesSelectedIds={setFaxesSelectedIds}
        currentFaxId={currentFaxId}
        faxesInbox={faxesInbox ?? []}
        faxesOutbox={faxesOutbox ?? []}
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
        rangeStart={rangeStart}
        initialRangeStart={initialRangeStart}
        initialRangeEnd={initialRangeEnd}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        search={search}
        setSearch={setSearch}
        all={all}
        setAll={setAll}
      />
      <div className="fax-content">
        <FaxLeftBar
          section={section}
          setSection={setSection}
          setCurrentFaxId={setCurrentFaxId}
          setFaxesSelectedIds={setFaxesSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
        />
        <FaxBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          faxesSelectedIds={faxesSelectedIds}
          setFaxesSelectedIds={setFaxesSelectedIds}
          currentFaxId={currentFaxId}
          currentCallerId={currentCallerId}
          setCurrentFaxId={setCurrentFaxId}
          setCurrentCallerId={setCurrentCallerId}
          faxesInbox={faxesInbox}
          faxesOutbox={faxesOutbox}
          isPendingInbox={isPendingInbox}
          isPendingOutbox={isPendingOutbox}
          errorInbox={errorInbox}
          errorOutbox={errorOutbox}
          search={search}
        />
      </div>
    </div>
  );
};

export default Faxes;
