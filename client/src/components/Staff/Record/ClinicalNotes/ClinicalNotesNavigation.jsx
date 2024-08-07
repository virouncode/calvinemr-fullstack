import GoToBottomIcon from "../../../UI/Icons/GoToBottom";
import GoToTopIcon from "../../../UI/Icons/GoToTopIcon";

const ClinicalNotesNavigation = ({ handleGoToTop, handleGoToEnd }) => {
  return (
    <>
      <GoToTopIcon ml={5} mr={2} onClick={handleGoToTop} />
      <GoToBottomIcon mr={2} onClick={handleGoToEnd} />
    </>
  );
};

export default ClinicalNotesNavigation;
