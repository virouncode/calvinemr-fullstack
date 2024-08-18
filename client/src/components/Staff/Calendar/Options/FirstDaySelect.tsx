import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { SettingsType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";

const FirstDaySelect = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    try {
      const datasToPut: SettingsType = {
        ...user.settings,
        first_day: parseInt(value),
      };
      const response = await xanoPut(
        `/settings/${user.settings.id}`,
        "staff",
        datasToPut
      );
      socket?.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: response,
          },
        },
      });
      toast.success("Saved preference", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save preference: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  return (
    <div className="calendar__day-select">
      <label htmlFor="firstDay">First day of the week</label>
      <select
        name="firstDay"
        value={user.settings.first_day}
        onChange={handleChange}
        id="firstDay"
      >
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
        <option value="7">Sunday</option>
      </select>
    </div>
  );
};

export default FirstDaySelect;
