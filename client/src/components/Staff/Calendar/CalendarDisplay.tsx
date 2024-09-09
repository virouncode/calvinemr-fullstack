import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import {
  EventDragStartArg,
  EventResizeDoneArg,
  EventResizeStartArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import NewWindow from "react-new-window";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { SiteType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { getRemainingStaff } from "../../../utils/appointments/parseToEvents";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import SiteSelect from "../../UI/Lists/SiteSelect";
import FakeWindow from "../../UI/Windows/FakeWindow";
import CalendarView from "./CalendarView";
import DaySheet from "./DaySheet";
import EventForm from "./EventForm/EventForm";
import TimelineView from "./TimelineView";
import ToggleView from "./ToggleView";

type CalendarDisplayProps = {
  timelineVisible: boolean;
  setTimelineVisible: React.Dispatch<React.SetStateAction<boolean>>;
  timelineSiteId: number;
  setTimelineSiteId: React.Dispatch<React.SetStateAction<number>>;
  events: EventInput[] | undefined;
  sites: SiteType[];
  currentView: string;
  printDayVisible: boolean;
  setPrintDayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handlePrintDay: () => void;
  rangeStart: number;
  rangeEnd: number;
  initialDate: number;
  fcRef: React.MutableRefObject<FullCalendar | null>;
  handleDatesSet: (info: DatesSetArg) => void;
  handleDateSelect: (info: DateSelectArg) => Promise<void>;
  handleDragStart: (info: EventDragStartArg) => void;
  handleEventClick: (info: EventClickArg) => void;
  handleDrop: (info: EventDropArg) => void;
  handleResize: (info: EventResizeDoneArg) => void;
  handleResizeStart: (info: EventResizeStartArg) => void;
  renderEventContent: (info: EventContentArg) => React.JSX.Element | undefined;
  formVisible: boolean;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentEvent: React.MutableRefObject<EventInput | null>;
  currentElement: React.MutableRefObject<HTMLElement | null>;
  lastCurrentId: React.MutableRefObject<string>;
  setFormColor: React.Dispatch<React.SetStateAction<string>>;
  formColor: string;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
  selectable: boolean;
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
  isFirstEvent: boolean;
};

const CalendarDisplay = ({
  timelineVisible,
  setTimelineVisible,
  timelineSiteId,
  setTimelineSiteId,
  events,
  sites,
  currentView,
  printDayVisible,
  setPrintDayVisible,
  handlePrintDay,
  rangeStart,
  rangeEnd,
  initialDate,
  fcRef,
  handleDatesSet,
  handleDateSelect,
  handleDragStart,
  handleEventClick,
  handleDrop,
  handleResize,
  handleResizeStart,
  renderEventContent,
  formVisible,
  setFormVisible,
  currentEvent,
  currentElement,
  lastCurrentId,
  setFormColor,
  formColor,
  setSelectable,
  selectable,
  hostsIds,
  setHostsIds,
  sitesIds,
  setSitesIds,
  isFirstEvent,
}: CalendarDisplayProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="calendar__display">
      {timelineVisible && (
        <div className="calendar__select-site">
          <SiteSelect
            handleSiteChange={(e) =>
              setTimelineSiteId(parseInt(e.target.value))
            }
            sites={sites}
            value={timelineSiteId}
            label="Site"
          />
        </div>
      )}
      <ToggleView
        setTimelineVisible={setTimelineVisible}
        timelineVisible={timelineVisible}
      />
      {(currentView === "timeGrid" || timelineVisible) && (
        <button
          onClick={handlePrintDay}
          disabled={events?.length === 0}
          className="calendar__print-btn"
        >
          Print day sheet
        </button>
      )}
      {printDayVisible && (
        <NewWindow
          title={`Day sheet: ${timestampToDateISOTZ(rangeStart)}`}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPrintDayVisible(false)}
        >
          <DaySheet
            events={events}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />
        </NewWindow>
      )}
      {!timelineVisible ? (
        <CalendarView
          initialDate={initialDate}
          slotDuration={user.settings.slot_duration}
          firstDay={user.settings.first_day}
          fcRef={fcRef}
          isSecretary={user.title === "Secretary"}
          events={events}
          handleDatesSet={handleDatesSet}
          handleDateSelect={handleDateSelect}
          handleDragStart={handleDragStart}
          handleEventClick={handleEventClick}
          handleDrop={handleDrop}
          handleResize={handleResize}
          handleResizeStart={handleResizeStart}
          renderEventContent={renderEventContent}
          selectable={selectable}
          currentView={currentView}
        />
      ) : (
        <TimelineView
          initialDate={initialDate}
          slotDuration={user.settings.slot_duration}
          firstDay={user.settings.first_day}
          fcRef={fcRef}
          isSecretary={user.title === "Secretary"}
          events={events}
          handleDatesSet={handleDatesSet}
          handleDateSelect={handleDateSelect}
          handleDragStart={handleDragStart}
          handleEventClick={handleEventClick}
          handleDrop={handleDrop}
          handleResize={handleResize}
          handleResizeStart={handleResizeStart}
          renderEventContent={renderEventContent}
          site={sites.find(({ id }) => id === timelineSiteId)}
          selectable={selectable}
        />
      )}
      {formVisible && (
        <FakeWindow
          title={`APPOINTMENT DETAILS`}
          width={1050}
          height={790}
          x={(window.innerWidth - 1050) / 2}
          y={(window.innerHeight - 790) / 2}
          color={formColor}
          setPopUpVisible={setFormVisible}
          closeCross={false}
          textColor="#3D375A"
        >
          <EventForm
            currentEvent={currentEvent}
            currentElement={currentElement}
            lastCurrentId={lastCurrentId}
            setFormVisible={setFormVisible}
            remainingStaff={getRemainingStaff(user.id, staffInfos)}
            setFormColor={setFormColor}
            setCalendarSelectable={setSelectable}
            hostsIds={hostsIds}
            setHostsIds={setHostsIds}
            sites={sites}
            setTimelineSiteId={setTimelineSiteId}
            sitesIds={sitesIds}
            setSitesIds={setSitesIds}
            isFirstEvent={isFirstEvent}
            setSelectable={setSelectable}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CalendarDisplay;
