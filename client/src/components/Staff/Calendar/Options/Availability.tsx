import React from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useAvailability } from "../../../../hooks/reactquery/queries/availabilityQueries";
import { UserStaffType } from "../../../../types/app";
import PenIcon from "../../../UI/Icons/PenIcon";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import AvailabilityEditor from "./AvailabilityEditor";

type AvailabilityProps = {
  editAvailability: boolean;
  setEditAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
};

const Availability = ({
  editAvailability,
  setEditAvailability,
  isPending,
}: AvailabilityProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  //Queries
  const {
    data: availability,
    isPending: isPendingAvailability,
    error,
  } = useAvailability(user.id);

  const handleEdit = () => {
    setEditAvailability((v) => !v);
  };

  if (isPendingAvailability)
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
          <div>
            {isPending ? (
              <CircularProgressSmall />
            ) : (
              <PenIcon onClick={handleEdit}></PenIcon>
            )}
          </div>
        </div>
        {editAvailability && (
          <FakeWindow
            title="MY AVAILABILITY"
            width={window.innerWidth}
            height={window.innerHeight}
            x={0}
            y={0}
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
