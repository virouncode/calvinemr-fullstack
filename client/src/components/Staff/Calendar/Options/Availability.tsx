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
          <span style={{ width: "0.8rem", display: "inline-block" }}>
            {isPending ? (
              <CircularProgressSmall />
            ) : (
              <PenIcon onClick={handleEdit}></PenIcon>
            )}
          </span>
        </div>
        {editAvailability && (
          <FakeWindow
            title="MY AVAILABILITY"
            width={1024}
            height={500}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 500) / 2}
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
