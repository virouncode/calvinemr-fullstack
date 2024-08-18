import React from "react";

type RoomOptionProps = {
  roomName: string;
  roomId: string;
  isRoomOccupied: (roomId: string) => boolean;
};

const RoomOption = ({ roomName, roomId, isRoomOccupied }: RoomOptionProps) => {
  return (
    <option value={roomId}>
      {roomName} {isRoomOccupied(roomId) ? "(Occupied)" : ""}
    </option>
  );
};
export default RoomOption;
