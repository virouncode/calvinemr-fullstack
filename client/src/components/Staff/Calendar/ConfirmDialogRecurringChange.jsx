
import logo from "../../../assets/img/logoRectTest.png";

const ConfirmDialogRecurringChange = ({
  handleChangeThisEvent,
  handleChangeAllEvents,
  handleChangeAllFutureEvents,
  handleCancel,
  isFirstEvent = false,
  statusAdvice = false,
}) => {
  const positionY = window.innerHeight / 2 + window.scrollY;

  return (
    <>
      <div
        style={{ height: `${document.body.clientHeight}px` }}
        className="confirm-container"
      >
        <div
          style={{ top: `${positionY}px` }}
          className="confirm-dialog confirm-dialog--recurring"
        >
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-header-logo">
              <img src={logo} alt="calvin-EMR-logo" />
            </div>
            <h2 style={{ fontSize: "1rem" }}>{"Confirmation"}</h2>
          </div>
          <p style={{ fontSize: "0.85rem", padding: "10px", margin: "0" }}>
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
              You're changing a repeating event
            </p>
            <span>
              {`Do you want to change only this occurrence (this will move it out of the series),\n or all ${
                isFirstEvent
                  ? "occurences"
                  : "future occurrences (this will create a new series)"
              } ?`}
              {statusAdvice &&
                "Since you changed the event status we recommend to change only this event since this status may not be relevant for all events."}
            </span>
          </p>
          <p className="confirm-dialog-btn-container confirm-dialog-btn-container--recurring">
            <button type="button" onClick={handleChangeThisEvent}>
              Only this event
            </button>
            <button
              type="button"
              onClick={
                isFirstEvent
                  ? handleChangeAllEvents
                  : handleChangeAllFutureEvents
              }
            >
              {isFirstEvent ? "All events" : "All future events"}
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialogRecurringChange;
