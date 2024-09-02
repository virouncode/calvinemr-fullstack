import React from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useAvailability } from "../../../../hooks/reactquery/queries/availabilityQueries";
import { UserStaffType } from "../../../../types/app";
import PenIcon from "../../../UI/Icons/PenIcon";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
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
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  //Queries
  const { data: availability, isPending, error } = useAvailability(user.id);

  const handleEdit = () => {
    setEditAvailability((v) => !v);
  };

  if (isPending)
    return (
      <div className="calendar__availability">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="calendar__availability">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  return (
    availability && (
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
            <AvailabilityEditor
              setEditAvailability={setEditAvailability}
              availability={availability}
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default Availability;
