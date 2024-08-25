import React from "react";
import PenIcon from "../../../UI/Icons/PenIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import AvailabilityEditor from "./AvailabilityEditor";

type AvailabilityProps = {
  editAvailability: boolean;
  setEditAvailability: React.Dispatch<React.SetStateAction<boolean>>;
};

const Availability = ({
  editAvailability,
  setEditAvailability,
}: AvailabilityProps) => {
  const handleEdit = () => {
    setEditAvailability((v) => !v);
  };
  return (
    <>
      <div className="calendar__availability">
        <label>Availability</label>
        <PenIcon onClick={handleEdit}></PenIcon>
      </div>
      {editAvailability && (
        <FakeWindow
          title="MY AVAILABILITY"
          width={1000}
          height={400}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 400) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditAvailability}
        >
          <AvailabilityEditor setEditAvailability={setEditAvailability} />
        </FakeWindow>
      )}
    </>
  );
};

export default Availability;
