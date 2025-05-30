import React, { useRef } from "react";
import { RoomType, SiteFormType, SiteType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import RoomItem from "./RoomItem";
// prettier-ignore
const roomIds = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y"];

type RoomsFormProps = {
  formDatas: SiteFormType | SiteType;
  setFormDatas: React.Dispatch<React.SetStateAction<SiteFormType | SiteType>>;

  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
};

const RoomsForm = ({ formDatas, setFormDatas, setErrMsg }: RoomsFormProps) => {
  //Hooks
  const roomIdCounter = useRef("a");

  const handleAddRoom = () => {
    setErrMsg("");
    const idsTaken = [...(formDatas.rooms ?? [])].map(({ id }) => id);
    let nextId = roomIdCounter.current;
    let i = 0;
    while (idsTaken.includes(nextId)) {
      i++;
      nextId = roomIds[i];
    }
    roomIdCounter.current = nextId;
    setFormDatas({
      ...formDatas,
      rooms: [
        ...(formDatas.rooms ?? []),
        { id: roomIdCounter.current, title: "" },
      ],
    });
  };

  const handleChangeRoomTitle = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      rooms: (formDatas.rooms ?? []).map(
        (room: { id: string; title: string }) => {
          return room.id === id ? { id: id, title: value } : room;
        }
      ),
    });
  };

  const handleDeleteRoom = (id: string) => {
    setFormDatas({
      ...formDatas,
      rooms: (formDatas.rooms ?? []).filter(
        (room: { id: string; title: string }) => room.id !== id
      ),
    });
    const idsTaken = (formDatas.rooms ?? [])
      .filter((room: { id: string; title: string }) => room.id !== id)
      .map(({ id }) => id);
    let nextId = "a";
    let i = 0;
    while (idsTaken.includes(nextId)) {
      i++;
      nextId = roomIds[i];
    }
    roomIdCounter.current = nextId;
  };

  return (
    <div className="site-form__rooms">
      <label>Rooms*:</label>
      <Button onClick={handleAddRoom} label="Add a new room" />
      <ul>
        {(formDatas?.rooms ?? [])
          .filter(({ id }) => id !== "z")
          .sort((a: RoomType, b: RoomType) => a.id.localeCompare(b.id))
          .map((room: RoomType) => (
            <RoomItem
              room={room}
              key={room.id}
              handleChangeRoomTitle={handleChangeRoomTitle}
              handleDeleteRoom={handleDeleteRoom}
            />
          ))}
      </ul>
    </div>
  );
};

export default RoomsForm;
