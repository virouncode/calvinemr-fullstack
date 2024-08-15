import React from "react";
import logo from "../../../assets/img/logoRectTest.png";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";

type ConfirmDialogRecurringDeleteProps = {
  handleDeleteThisEvent: () => Promise<void>;
  handleDeleteAllEvents: () => Promise<void>;
  handleDeleteAllFutureEvents: () => Promise<void>;
  handleCancel: () => void;
  isFirstEvent?: boolean;
};

const ConfirmDialogRecurringDelete = ({
  handleDeleteThisEvent,
  handleDeleteAllEvents,
  handleDeleteAllFutureEvents,
  handleCancel,
  isFirstEvent = false,
}: ConfirmDialogRecurringDeleteProps) => {
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
            <Button onClick={handleDeleteThisEvent} label="Only this event" />
            <Button
              onClick={
                isFirstEvent
                  ? handleDeleteAllEvents
                  : handleDeleteAllFutureEvents
              }
              label={
                isFirstEvent ? "Delete all events" : "Delete all future events"
              }
            />
            <CancelButton onClick={handleCancel} />
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialogRecurringDelete;
