import NewWindow from "react-new-window";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { getRemainingStaff } from "../../../utils/appointments/parseToEvents";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import FakeWindow from "../../UI/Windows/FakeWindow";
import EventForm from "../EventForm/EventForm";
import SiteSelect from "../EventForm/SiteSelect";
import CalendarView from "./CalendarView";
import DaySheet from "./DaySheet";
import TimelineView from "./TimelineView";
import ToggleView from "./ToggleView";

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
  setFormColor,
  formColor,
  setSelectable,
  selectable,
  hostsIds,
  setHostsIds,
  sitesIds,
  setSitesIds,
  isFirstEvent,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="calendar__display">
      {timelineVisible && (
        <div className="calendar-section__select-site">
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
        <Button
          onClick={handlePrintDay}
          disabled={events?.length === 0}
          className="calendar__print-day"
          label={"Print day sheet"}
        />
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
            setFormVisible={setFormVisible}
            remainingStaff={getRemainingStaff(user.id, staffInfos)}
            setFormColor={setFormColor}
            setSelectable={setSelectable}
            hostsIds={hostsIds}
            setHostsIds={setHostsIds}
            sites={sites}
            setTimelineSiteId={setTimelineSiteId}
            sitesIds={sitesIds}
            setSitesIds={setSitesIds}
            isFirstEvent={isFirstEvent}
            setCalendarSelectable={setSelectable}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CalendarDisplay;
