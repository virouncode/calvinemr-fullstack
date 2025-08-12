import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";
import {
  useFaxesInbox,
  useFaxesOutbox,
} from "../../../hooks/reactquery/queries/faxQueries";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import FaxBox from "./FaxBox";
import FaxLeftBar from "./FaxLeftBar";
import FaxToolBar from "./FaxToolBar";

export const FAXES_PER_PAGE = 20;

// Type pour les messages socket
interface SocketMessage {
  action: string;
  route: string;
  content?: Record<string, unknown>;
}

const Faxes = () => {
  //Hooks
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
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
  const [currentPage, setCurrentPage] = useState(1);

  const initialRangeStart = useRef(
    timestampToDateISOTZ(getStartOfTheMonthTZ()).split("-").join("")
  );
  const initialRangeEnd = useRef(
    timestampToDateISOTZ(getEndOfTheMonthTZ()).split("-").join("")
  );
  const startIndex = (currentPage - 1) * FAXES_PER_PAGE;
  const endIndex = startIndex + FAXES_PER_PAGE;

  // Écoute des événements socket pour rafraîchir les données de fax
  useEffect(() => {
    const handleSocketMessage = (message: SocketMessage) => {
      if (message.route === "FAX DATA" && message.action === "refresh") {
        // Invalider les queries pour forcer un refetch
        queryClient.invalidateQueries({ queryKey: ["faxes inbox"] });
        queryClient.invalidateQueries({ queryKey: ["faxes outbox"] });
      }
    };

    socket?.on("message", handleSocketMessage);
    return () => {
      socket?.off("message", handleSocketMessage);
    };
  }, [socket, queryClient]);
  //Queries
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

  const numberOfFaxes =
    section === "Received faxes" ? faxesInbox?.length : faxesOutbox?.length;
  const totalPages = Math.ceil((numberOfFaxes ?? 0) / FAXES_PER_PAGE);

  return (
    <div className="fax__container">
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numberOfFaxes={numberOfFaxes}
        totalPages={totalPages}
      />
      <div className="fax__content">
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
          faxesInbox={faxesInbox?.slice(startIndex, endIndex) ?? []}
          faxesOutbox={faxesOutbox?.slice(startIndex, endIndex) ?? []}
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
