import React from "react";
import Radio from "../../../../UI/Radio/Radio";
import { onChange } from "react-toastify/dist/core/store";

type RoomRadioItemProps = {
  roomId: string;
  roomName: string;
  isRoomOccupied: (roomId: string) => boolean;
  handleRoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRoomSelected: (roomId: string) => boolean;
};

const RoomRadioItem = ({
  roomId,
  roomName,
  isRoomOccupied,
  handleRoomChange,
  isRoomSelected,
}: RoomRadioItemProps) => {
  return (
    <li className="event-form__item event-form__item--radio">
      <Radio
        id={roomId}
        name="room_id"
        value={roomId}
        checked={isRoomSelected(roomId)}
        onChange={handleRoomChange}
        label={`${roomName}` + `${isRoomOccupied(roomId) ? " (Occupied)" : ""}`}
      />
    </li>
  );
};

export default RoomRadioItem;
