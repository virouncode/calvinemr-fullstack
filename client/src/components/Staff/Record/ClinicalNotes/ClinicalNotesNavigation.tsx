import React from "react";
import GoToBottomIcon from "../../../UI/Icons/GoToBottom";
import GoToTopIcon from "../../../UI/Icons/GoToTopIcon";

type ClinicalNotesNavigationProps = {
  handleGoToTop: () => void;
  handleGoToEnd: () => void;
};

const ClinicalNotesNavigation = ({
  handleGoToTop,
  handleGoToEnd,
}: ClinicalNotesNavigationProps) => {
  return (
    <>
      <GoToTopIcon onClick={handleGoToTop} />
      <GoToBottomIcon onClick={handleGoToEnd} />
    </>
  );
};

export default ClinicalNotesNavigation;
