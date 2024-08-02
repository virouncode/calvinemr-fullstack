
import logo from "../../../assets/img/logoRectTest.png";

const ConfirmDialogRecurringDelete = ({
  handleDeleteThisEvent,
  handleDeleteAllEvents,
  handleDeleteAllFutureEvents,
  handleCancel,
  isFirstEvent = false,
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
            <strong>You're deleting a repeating event</strong>

            <br />
            <span>
              {`Do you want to delete only this occurrence,\n or all ${
                isFirstEvent ? "" : "future "
              }occurrences ?`}
            </span>
          </p>
          <p className="confirm-dialog-btn-container confirm-dialog-btn-container--recurring">
            <button type="button" onClick={handleDeleteThisEvent}>
              Delete only this event
            </button>
            <button
              type="button"
              onClick={
                isFirstEvent
                  ? handleDeleteAllEvents
                  : handleDeleteAllFutureEvents
              }
            >
              {isFirstEvent ? "Delete all events" : "Delete all future events"}
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

export default ConfirmDialogRecurringDelete;
