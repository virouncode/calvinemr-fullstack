import React from "react";
import logo from "../../../assets/img/logoRectTest.png";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";

type ConfirmDialogRecurringChangeProps = {
  handleChangeThisEvent: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleChangeAllEvents: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleChangeAllFutureEvents: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isFirstEvent?: boolean;
  statusAdvice?: boolean;
};
const ConfirmDialogRecurringChange = ({
  handleChangeThisEvent,
  handleChangeAllEvents,
  handleChangeAllFutureEvents,
  handleCancel,
  isFirstEvent = false,
  statusAdvice = false,
}: ConfirmDialogRecurringChangeProps) => {
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
          <div style={{ fontSize: "$size-sm", padding: "10px", margin: "0" }}>
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
          </div>
          <div className="confirm-dialog-btn-container confirm-dialog-btn-container--recurring">
            <Button onClick={handleChangeThisEvent} label="Only this event" />
            <Button
              onClick={
                isFirstEvent
                  ? handleChangeAllEvents
                  : handleChangeAllFutureEvents
              }
              label={isFirstEvent ? "All events" : "All future events"}
            />
            <CancelButton onClick={handleCancel} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialogRecurringChange;
