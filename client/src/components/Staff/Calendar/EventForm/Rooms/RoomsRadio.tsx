import React from "react";
import { RoomType } from "../../../../../types/api";
import RoomRadioItem from "./RoomRadioItem";

type RoomsRadioProps = {
  handleRoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  roomSelectedId: string;
  rooms: RoomType[];
  isRoomOccupied: (roomId: string) => boolean;
  label?: string;
};

const RoomsRadio = ({
  handleRoomChange,
  roomSelectedId,
  rooms,
  isRoomOccupied,
  label = "Room",
}: RoomsRadioProps) => {
  const isRoomSelected = (roomId: string) => roomSelectedId === roomId;
  return (
    <>
      {label && <p>{label}</p>}
      <div className="event-form__radio-container">
        {rooms.map((room) => (
          <RoomRadioItem
            key={room.id}
            roomId={room.id}
            roomName={room.title}
            isRoomOccupied={isRoomOccupied}
            handleRoomChange={handleRoomChange}
            isRoomSelected={isRoomSelected}
          />
        ))}
      </div>
    </>
  );
};

export default RoomsRadio;
