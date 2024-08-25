import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { SettingsType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";

const SlotSelect = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    try {
      const datasToPut: SettingsType = {
        ...user.settings,
        slot_duration: value,
      };
      const response: SettingsType = await xanoPut(
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
      if (err instanceof Error)
        toast.error(`Error: unable to save preference: ${err.message}`, {
          containerId: "A",
        });
    }
  };
  return (
    <div className="calendar__slot-select">
      <label htmlFor="duration">Time Slot Duration</label>
      <select
        id="duration"
        name="duration"
        value={user.settings.slot_duration}
        onChange={handleChange}
      >
        <option value="00:05">5 mn</option>
        <option value="00:10">10 mn</option>
        <option value="00:15">15 mn</option>
        <option value="00:20">20 mn</option>
        <option value="00:30">30 mn</option>
        <option value="01:00">1 h</option>
      </select>
    </div>
  );
};

export default SlotSelect;
