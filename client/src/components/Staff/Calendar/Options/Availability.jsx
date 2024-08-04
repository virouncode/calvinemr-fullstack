import FakeWindow from "../../../UI/Windows/FakeWindow";
import AvailabilityEditor from "./AvailabilityEditor";

const Availability = ({
  editAvailabilityVisible,
  setEditAvailabilityVisible,
}) => {
  const handleEdit = () => {
    setEditAvailabilityVisible((v) => !v);
  };
  return (
    <>
      <div className="calendar__availability">
        <label>Availability</label>
        <i
          onClick={handleEdit}
          style={{ cursor: "pointer" }}
          className="fa-regular fa-pen-to-square"
        ></i>
      </div>
      {editAvailabilityVisible && (
        <FakeWindow
          title="MY AVAILABILITY"
          width={1000}
          height={400}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 400) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditAvailabilityVisible}
        >
          <AvailabilityEditor
            setEditAvailabilityVisible={setEditAvailabilityVisible}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default Availability;
