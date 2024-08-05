import Radio from "../../../UI/Radio/Radio";

const RoomRadioItem = ({
  roomId,
  roomName,
  isRoomOccupied,
  handleRoomChange,
  isRoomSelected,
}) => {
  return (
    <div className="event-form__item event-form__item--radio">
      <Radio
        id={roomId}
        name="room_id"
        value={roomId}
        checked={isRoomSelected(roomId)}
        onChange={handleRoomChange}
        label={`${roomName}` + `${isRoomOccupied(roomId) ? " (Occupied)" : ""}`}
      />
    </div>
  );
};

export default RoomRadioItem;
