import { useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { toCategoriesLength } from "../../../../utils/appointments/toCategoriesLength";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import FilterCheckboxesSection from "./FilterCheckboxesSection";

const FilterCheckboxes = ({ hostsIds, setHostsIds, remainingStaff }) => {
  //======================= HOOKS ==========================//
  const { staffInfos } = useStaffInfosContext();
  const [
    doctorsLength,
    nursesLength,
    secretariesLength,
    medStudentsLength,
    nursingStudentsLength,
    labTechsLength,
    usTechsLength,
    nutritionistsLength,
    psychosLength,
    physiosLength,
    othersLength,
  ] = toCategoriesLength(staffInfos);

  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );

  const [hostsCategories, setHostsCategories] = useState([]);
  const [hostsDoctorsIds, setHostsDoctorsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Doctor")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsNursesIds, setHostsNursesIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Nurse")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsSecretariesIds, setHostsSecretariesIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Secretary")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsMedStudentsIds, setHostsMedStudentsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Medical Student")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsNursingStudentsIds, setHostsNursingStudentsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Nursing Student")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsLabTechsIds, setHostsLabTechsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Lab Technician")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsUSTechsIds, setHostsUSTechsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Ultra Sound Technician")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsNutritionistsIds, setHostsNutritionistsIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Nutritionist")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsPhysiosIds, setHostsPhysiosIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Physiotherapist")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsPsychosIds, setHostsPsychosIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Psychotherapist")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );
  const [hostsOthersIds, setHostsOthersIds] = useState(
    activeStaff
      .filter(({ title }) => title === "Other")
      .filter(({ id }) => hostsIds.includes(id))
      .map(({ id }) => id)
  );

  //======================== EVENT HANDLERS ===================//

  const handleCheck = async (e, staffId) => {
    const id = parseInt(staffId);
    const name = e.target.name;

    if (e.target.checked) {
      setHostsIds([...hostsIds, id]);
      switch (name) {
        case "doctor":
          setHostsDoctorsIds([...hostsDoctorsIds, id]);
          if ([...hostsDoctorsIds, id].length === doctorsLength)
            setHostsCategories([...hostsCategories, "Doctors"]);
          break;
        case "nurse":
          setHostsNursesIds([...hostsNursesIds, id]);
          if ([...hostsNursesIds, id].length === nursesLength)
            setHostsCategories([...hostsCategories, "Nurses"]);
          break;
        case "secretary":
          setHostsSecretariesIds([...hostsSecretariesIds, id]);
          if ([...hostsSecretariesIds, id].length === secretariesLength)
            setHostsCategories([...hostsCategories, "Secretaries"]);
          break;
        case "medical student":
          setHostsMedStudentsIds([...hostsMedStudentsIds, id]);
          if ([...hostsMedStudentsIds, id].length === medStudentsLength)
            setHostsCategories([...hostsCategories, "Medical Students"]);
          break;
        case "nursing student":
          setHostsNursingStudentsIds([...hostsNursingStudentsIds, id]);
          if ([...hostsNursingStudentsIds, id].length === nursingStudentsLength)
            setHostsCategories([...hostsCategories, "Nursing Students"]);
          break;
        case "nutritionist":
          setHostsNutritionistsIds([...hostsNutritionistsIds, id]);
          if ([...hostsNutritionistsIds, id].length === nutritionistsLength)
            setHostsCategories([...hostsCategories, "Nutritionists"]);
          break;
        case "physiotherapist":
          setHostsPhysiosIds([...hostsPhysiosIds, id]);
          if ([...hostsPhysiosIds, id].length === physiosLength)
            setHostsCategories([...hostsCategories, "Physiotherapists"]);
          break;
        case "psychologist":
          setHostsPsychosIds([...hostsPsychosIds, id]);
          if ([...hostsPsychosIds, id].length === psychosLength)
            setHostsCategories([...hostsCategories, "Psychologists"]);
          break;
        case "lab technician":
          setHostsLabTechsIds([...hostsLabTechsIds, id]);
          if ([...hostsLabTechsIds, id].length === labTechsLength)
            setHostsCategories([...hostsCategories, "Lab Techs"]);
          break;
        case "ultra sound technician":
          setHostsUSTechsIds([...hostsUSTechsIds, id]);
          if ([...hostsUSTechsIds, id].length === usTechsLength)
            setHostsCategories([...hostsCategories, "Ultra Sound Techs"]);
          break;
        case "other":
          setHostsOthersIds([...hostsOthersIds, id]);
          if ([...hostsOthersIds, id].length === othersLength)
            setHostsCategories([...hostsCategories, "Others"]);
          break;
        default:
          break;
      }
    } else {
      setHostsIds(hostsIds.filter((hostId) => hostId !== id));
      switch (name) {
        case "doctor":
          setHostsDoctorsIds(hostsDoctorsIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Doctors")
          );
          break;
        case "nurse":
          setHostsNursesIds(hostsNursesIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Nurses")
          );
          break;
        case "secretary":
          setHostsSecretariesIds(
            hostsSecretariesIds.filter((hostId) => hostId !== id)
          );
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Secretaries")
          );
          break;
        case "medical student":
          setHostsMedStudentsIds(
            hostsMedStudentsIds.filter((hostId) => hostId !== id)
          );
          setHostsCategories(
            hostsCategories.filter(
              (category) => category !== "Medical Students"
            )
          );
          break;
        case "nursing student":
          setHostsNursingStudentsIds(
            hostsNursingStudentsIds.filter((hostId) => hostId !== id)
          );
          setHostsCategories(
            hostsCategories.filter(
              (category) => category !== "Nursing Students"
            )
          );
          break;
        case "nutritionist":
          setHostsNutritionistsIds(
            hostsNutritionistsIds.filter((hostId) => hostId !== id)
          );
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Nutritionists")
          );
          break;
        case "physiotherapist":
          setHostsPhysiosIds(hostsPhysiosIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter(
              (category) => category !== "Physiotherapists"
            )
          );
          break;
        case "psychotherapist":
          setHostsPsychosIds(hostsPsychosIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter(
              (category) => category !== "Psychotherapists"
            )
          );
          break;
        case "lab technician":
          setHostsLabTechsIds(
            hostsLabTechsIds.filter((hostId) => hostId !== id)
          );
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Lab Techs")
          );
          break;
        case "ultra sound technician":
          setHostsUSTechsIds(hostsUSTechsIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter(
              (category) => category !== "Ultra Sound Techs"
            )
          );
          break;
        case "other":
          setHostsOthersIds(hostsOthersIds.filter((hostId) => hostId !== id));
          setHostsCategories(
            hostsCategories.filter((category) => category !== "Others")
          );
          break;
        default:
          break;
      }
    }
  };

  const handleCheckCategory = async (e, category) => {
    const checked = e.target.checked;
    if (checked) {
      setHostsCategories([...hostsCategories, category]);
      //Add all the hosts from the category
      let hostsIdsToAdd = activeStaff
        .filter(({ title }) => title === categoryToTitle(category))
        .filter(({ id }) => !hostsIds.includes(id))
        .map(({ id }) => id);
      setHostsIds([...hostsIds, ...hostsIdsToAdd]);
    } else {
      setHostsCategories(hostsCategories.filter((cat) => cat !== category));
      let hostsIdsToRemove = activeStaff
        .filter(({ title }) => title === categoryToTitle(category))
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id);
      setHostsIds(hostsIds.filter((id) => !hostsIdsToRemove.includes(id)));
    }
  };

  //======================== FUNCTIONS =====================//
  const isChecked = (staffId) => (hostsIds.includes(staffId) ? true : false);
  const isCategoryChecked = (category) => {
    return hostsCategories.includes(category) ? true : false;
  };

  return (
    <form className="filter-checkboxes">
      {doctorsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Doctors"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {nursesLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Nurses"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {secretariesLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Secretaries"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {labTechsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Lab Techs"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {usTechsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Ultra Sound Techs"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {nutritionistsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Nutritionists"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {psychosLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Psychologists"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {physiosLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Physiotherapists"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {medStudentsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Medical Students"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {nursingStudentsLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Nursing Students"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
      {othersLength !== 0 && (
        <div className="filter-checkboxes-section">
          <FilterCheckboxesSection
            isCategoryChecked={isCategoryChecked}
            handleCheckCategory={handleCheckCategory}
            category="Others"
            isChecked={isChecked}
            handleCheck={handleCheck}
            remainingStaff={remainingStaff}
          />
        </div>
      )}
    </form>
  );
};

export default FilterCheckboxes;
