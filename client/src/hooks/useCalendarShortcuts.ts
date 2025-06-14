import { EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import { UseMutationResult } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { useEffect } from "react"; // Keep React import for other hooks and types
import { toast } from "react-toastify";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { confirmAlert } from "../components/UI/Confirm/ConfirmGlobal";
import { AppointmentType } from "../types/api";
import { UserStaffType } from "../types/app";
import useSocketContext from "./context/useSocketContext";
import useUserContext from "./context/useUserContext";

const useCalendarShortcuts = (
  fcRef: React.MutableRefObject<FullCalendar | null>,
  currentEvent: React.MutableRefObject<EventInput | null>,
  lastCurrentId: React.MutableRefObject<string>,
  eventCounter: React.MutableRefObject<number>,
  formVisible: boolean,
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>,
  editAvailability: boolean,
  setIsFirstEvent: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirmDlgRecDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>,
  appointmentDelete: UseMutationResult<void, Error, number, unknown>
) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();

  useEffect(() => {
    const handleKeyboardShortcut = async (e: WindowEventMap["keydown"]) => {
      if (editAvailability || formVisible) return;

      if (e.key === "ArrowLeft" && e.shiftKey) {
        // Shift + Left Arrow
        fcRef.current && fcRef.current.getApi().prev();
      } else if (e.key === "ArrowRight" && e.shiftKey) {
        // Shift + Right Arrow
        fcRef.current && fcRef.current.getApi().next();
      } else if (e.key === "T" && e.shiftKey) {
        // Shift + T
        fcRef.current && fcRef.current.getApi().today();
      } else if (
        currentEvent.current &&
        // (currentEvent.current.extendedProps?.host === user.id ||
        //   user.title === "Secretary") &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        // Backspace or Delete key
        if (currentEvent.current.extendedProps?.recurrence !== "Once") {
          const appointment: AppointmentType = await xanoGet(
            `/appointments/${parseInt(currentEvent.current.id as string)}`,
            "staff"
          );
          if (
            DateTime.fromJSDate(currentEvent.current.start as Date, {
              zone: "America/Toronto",
            }).toMillis() === appointment.start
          ) {
            setIsFirstEvent(true);
          } else {
            setIsFirstEvent(false);
          }
          setConfirmDlgRecDeleteVisible(true);
          return;
        }
        if (
          await confirmAlert({
            content: "Do you really want to remove this event ?",
          })
        ) {
          try {
            appointmentDelete.mutate(
              parseInt(currentEvent.current.id as string)
            );

            setFormVisible(false);
            setSelectable(true);
            currentEvent.current = null;
            lastCurrentId.current = "";
          } catch (err) {
            if (err instanceof Error)
              toast.error(
                `Error: unable to delete appointment: ${err.message}`,
                {
                  containerId: "A",
                }
              );
          }
        }
      } else if (e.key === "ArrowDown" && e.shiftKey) {
        // Shift + Down Arrow
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current += 1;
        (
          eventsList[eventCounter.current % eventsList.length] as HTMLElement
        ).click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else if (e.key === "ArrowUp" && e.shiftKey) {
        // Shift + Up Arrow
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current - 1 < 0
          ? (eventCounter.current = eventsList.length - 1)
          : (eventCounter.current -= 1);
        (
          eventsList[eventCounter.current % eventsList.length] as HTMLElement
        ).click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [
    currentEvent,
    eventCounter,
    fcRef,
    formVisible,
    lastCurrentId,
    setSelectable,
    setFormVisible,
    socket,
    user.id,
    user.title,
    editAvailability,
    setConfirmDlgRecDeleteVisible,
    setIsFirstEvent,
    appointmentDelete,
  ]);
};

export default useCalendarShortcuts;
