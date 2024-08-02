
import RoomOption from "./RoomOption";

const RoomsSelect = ({
  handleRoomChange,
  roomSelectedId,
  rooms,
  isRoomOccupied,
  label = true,
  disabled = false,
}) => {
  return (
    <>
      {label && <label htmlFor="room_id">Room</label>}
      <select
        name="room_id"
        onChange={handleRoomChange}
        value={roomSelectedId}
        disabled={disabled}
        id="room_id"
      >
        <option disabled value="">
          Choose a room...
        </option>
        {rooms.map((room) => (
          <RoomOption
            key={room.id}
            roomName={room.title}
            roomId={room.id}
            isRoomOccupied={isRoomOccupied}
          />
        ))}
      </select>
    </>
  );
};

export default RoomsSelect;
