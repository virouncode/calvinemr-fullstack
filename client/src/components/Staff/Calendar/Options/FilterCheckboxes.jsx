import { useEffect, useRef, useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import FilterCheckboxesSection from "./FilterCheckboxesSection";

const FilterCheckboxes = ({ hostsIds, setHostsIds, remainingStaff }) => {
  //======================= HOOKS ==========================//
  const { staffInfos } = useStaffInfosContext();
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const [hostsCategories, sethostsCategories] = useState([]); //Array
  const [hostsDoctorsIds, setHostsDoctorsIds] = useState([]); //Array
  const [hostsNursesIds, setHostsNursesIds] = useState([]); //Array
  const [hostsSecretariesIds, setHostsSecretariesIds] = useState([]); //Array
  const [hostsMedStudentsIds, setHostsMedStudentsIds] = useState([]); //Array
  const [hostsNursingStudentsIds, setHostsNursingStudentsIds] = useState([]); //Array
  const [hostsLabTechsIds, setHostsLabTechsIds] = useState([]); //Array
  const [hostsUSTechsIds, setHostsUSTechsIds] = useState([]); //Array
  const [hostsNutritionistsIds, setHostsNutritionistsIds] = useState([]); //Array
  const [hostsPhysiosIds, setHostsPhysiosIds] = useState([]); //Array
  const [hostsPsychosIds, setHostsPsychosIds] = useState([]); //Array
  const [hostsOthersIds, setHostsOthersIds] = useState([]); //Array

  const doctorsLength = useRef(0);
  const nursesLength = useRef(0);
  const secretariesLength = useRef(0);
  const medStudentsLength = useRef(0);
  const nursingStudentsLength = useRef(0);
  const labTechsLength = useRef(0);
  const usTechsLength = useRef(0);
  const nutritionistsLength = useRef(0);
  const psychosLength = useRef(0);
  const physiosLength = useRef(0);
  const othersLength = useRef(0);

  useEffect(() => {
    const activeStaff = staffInfos.filter(
      ({ account_status }) => account_status !== "Closed"
    );
    setHostsDoctorsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Doctor")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsNursesIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Nurse")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsSecretariesIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Secretary")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsMedStudentsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Medical Student")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsNursingStudentsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Nursing Student")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsLabTechsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Lab Technician")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsUSTechsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Ultra Sound Technician")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsNutritionistsIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Nutritionist")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsPhysiosIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Physiotherapist")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsPsychosIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Psychotherapist")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );
    setHostsOthersIds(
      activeStaff
        .filter((staff) => staff.account_status !== "Closed")
        .filter(({ title }) => title === "Other")
        .filter(({ id }) => hostsIds.includes(id))
        .map(({ id }) => id)
    );

    doctorsLength.current = activeStaff.filter(
      ({ title }) => title === "Doctor"
    ).length;
    nursesLength.current = activeStaff.filter(
      ({ title }) => title === "Nurse"
    ).length;
    secretariesLength.current = activeStaff.filter(
      ({ title }) => title === "Secretary"
    ).length;
    medStudentsLength.current = activeStaff.filter(
      ({ title }) => title === "Medical Student"
    ).length;
    nursingStudentsLength.current = activeStaff.filter(
      ({ title }) => title === "Nursing Student"
    ).length;
    labTechsLength.current = activeStaff.filter(
      ({ title }) => title === "Lab Technician"
    ).length;
    usTechsLength.current = activeStaff.filter(
      ({ title }) => title === "Ultra Sound Technician"
    ).length;
    nutritionistsLength.current = activeStaff.filter(
      ({ title }) => title === "Nutritionist"
    ).length;
    psychosLength.current = activeStaff.filter(
      ({ title }) => title === "Psychologist"
    ).length;
    physiosLength.current = activeStaff.filter(
      ({ title }) => title === "Physiotherapist"
    ).length;
    othersLength.current = activeStaff.filter(
      ({ title }) => title === "Other"
    ).length;
  }, [hostsIds, staffInfos]);

  //======================== EVENT HANDLERS ===================//

  const handleCheck = async (e) => {
    let newHostsIds = [...hostsIds];
    let newHostsDoctorsIds = [...hostsDoctorsIds];
    let newHostsNursesIds = [...hostsNursesIds];
    let newHostsSecretariesIds = [...hostsSecretariesIds];
    let newHostsMedStudentsIds = [...hostsMedStudentsIds];
    let newHostsNursingStudentsIds = [...hostsNursingStudentsIds];
    let newHostsLabTechsIds = [...hostsLabTechsIds];
    let newHostsUSTechsIds = [...hostsUSTechsIds];
    let newHostsNutritionistsIds = [...hostsNutritionistsIds];
    let newHostsPhysiosIds = [...hostsPhysiosIds];
    let newHostsPsychosIds = [...hostsPsychosIds];
    let newHostsOthersIds = [...hostsOthersIds];
    let newHostsCategories = [...hostsCategories];

    const id = parseInt(e.target.id);
    const name = e.target.name;

    if (e.target.checked) {
      newHostsIds = [...newHostsIds, id];
      switch (name) {
        case "doctor":
          newHostsDoctorsIds = [...newHostsDoctorsIds, id];
          if (newHostsDoctorsIds.length === doctorsLength.current) {
            newHostsCategories = [...newHostsCategories, "Doctors"];
            sethostsCategories(newHostsCategories);
          }
          setHostsDoctorsIds(newHostsDoctorsIds);
          break;
        case "nurse":
          newHostsNursesIds = [...newHostsNursesIds, id];
          if (newHostsNursesIds.length === nursesLength.current) {
            newHostsCategories = [...newHostsCategories, "Nurses"];
            sethostsCategories(newHostsCategories);
          }
          setHostsNursesIds(newHostsNursesIds);
          break;
        case "secretary":
          newHostsSecretariesIds = [...newHostsSecretariesIds, id];
          if (newHostsSecretariesIds.length === secretariesLength.current) {
            newHostsCategories = [...newHostsCategories, "Secretaries"];
            sethostsCategories(newHostsCategories);
          }
          setHostsSecretariesIds(newHostsSecretariesIds);
          break;
        case "medical student":
          newHostsMedStudentsIds = [...newHostsMedStudentsIds, id];
          if (newHostsMedStudentsIds.length === medStudentsLength.current) {
            newHostsCategories = [...newHostsCategories, "Medical Students"];
            sethostsCategories(newHostsCategories);
          }
          setHostsMedStudentsIds(newHostsMedStudentsIds);
          break;
        case "nursing student":
          newHostsNursingStudentsIds = [...newHostsNursingStudentsIds, id];
          if (
            newHostsNursingStudentsIds.length === nursingStudentsLength.current
          ) {
            newHostsCategories = [...newHostsCategories, "Nursing Students"];
            sethostsCategories(newHostsCategories);
          }
          setHostsNursingStudentsIds(newHostsNursingStudentsIds);
          break;
        case "nutritionist":
          newHostsNutritionistsIds = [...newHostsNutritionistsIds, id];
          if (newHostsNutritionistsIds.length === nutritionistsLength.current) {
            newHostsCategories = [...newHostsCategories, "Nutritionists"];
            sethostsCategories(newHostsCategories);
          }
          setHostsNutritionistsIds(newHostsNutritionistsIds);
          break;
        case "physiotherapist":
          newHostsPhysiosIds = [...newHostsPhysiosIds, id];
          if (newHostsPhysiosIds.length === physiosLength.current) {
            newHostsCategories = [...newHostsCategories, "Physiotherapists"];
            sethostsCategories(newHostsCategories);
          }
          setHostsPhysiosIds(newHostsPhysiosIds);
          break;
        case "psychologist":
          newHostsPsychosIds = [...newHostsPsychosIds, id];
          if (newHostsPsychosIds.length === psychosLength.current) {
            newHostsCategories = [...newHostsCategories, "Psychologists"];
            sethostsCategories(newHostsCategories);
          }
          setHostsPsychosIds(newHostsPsychosIds);
          break;
        case "lab technician":
          newHostsLabTechsIds = [...newHostsLabTechsIds, id];
          if (newHostsLabTechsIds.length === labTechsLength.current) {
            newHostsCategories = [...newHostsCategories, "Lab Techs"];
            sethostsCategories(newHostsCategories);
          }
          setHostsLabTechsIds(newHostsLabTechsIds);
          break;
        case "ultra sound technician":
          newHostsUSTechsIds = [...newHostsUSTechsIds, id];
          if (newHostsUSTechsIds.length === usTechsLength.current) {
            newHostsCategories = [...newHostsCategories, "Ultra Sound Techs"];
            sethostsCategories(newHostsCategories);
          }
          setHostsUSTechsIds(newHostsUSTechsIds);
          break;
        case "other":
          newHostsOthersIds = [...newHostsOthersIds, id];
          if (newHostsOthersIds.length === othersLength.current) {
            newHostsCategories = [...newHostsCategories, "Others"];
            sethostsCategories(newHostsCategories);
          }
          setHostsOthersIds(newHostsOthersIds);
          break;
        default:
          break;
      }
    } else {
      newHostsIds.splice(newHostsIds.indexOf(id), 1);
      switch (name) {
        case "doctor":
          newHostsDoctorsIds.splice(newHostsDoctorsIds.indexOf(id), 1);
          newHostsCategories.splice(newHostsCategories.indexOf("Doctors"), 1);
          sethostsCategories(newHostsCategories);
          setHostsDoctorsIds(newHostsDoctorsIds);
          break;
        case "nurse":
          newHostsNursesIds.splice(newHostsNursesIds.indexOf(id), 1);
          newHostsCategories.splice(newHostsCategories.indexOf("Nurses"), 1);
          sethostsCategories(newHostsCategories);
          setHostsNursesIds(newHostsNursesIds);
          break;
        case "secretary":
          newHostsSecretariesIds.splice(newHostsSecretariesIds.indexOf(id), 1);
          newHostsCategories.splice(
            newHostsCategories.indexOf("Secretaries"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsSecretariesIds(newHostsSecretariesIds);
          break;
        case "medical student":
          newHostsMedStudentsIds.splice(newHostsMedStudentsIds.indexOf(id), 1);
          newHostsCategories.splice(
            newHostsCategories.indexOf("Medical Students"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsMedStudentsIds(newHostsMedStudentsIds);
          break;
        case "nursing student":
          newHostsNursingStudentsIds.splice(
            newHostsNursingStudentsIds.indexOf(id),
            1
          );
          newHostsCategories.splice(
            newHostsCategories.indexOf("Nursing Students"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsNursingStudentsIds(newHostsNursingStudentsIds);
          break;
        case "nutritionist":
          newHostsNutritionistsIds.splice(
            newHostsNutritionistsIds.indexOf(id),
            1
          );
          newHostsCategories.splice(
            newHostsCategories.indexOf("Nutritionists"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsNutritionistsIds(newHostsNutritionistsIds);
          break;
        case "physiotherapist":
          newHostsPhysiosIds.splice(newHostsPhysiosIds.indexOf(id), 1);
          newHostsCategories.splice(
            newHostsCategories.indexOf("Physiotherapists"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsPhysiosIds(newHostsPhysiosIds);
          break;
        case "psychotherapist":
          newHostsPsychosIds.splice(newHostsPsychosIds.indexOf(id), 1);
          newHostsCategories.splice(
            newHostsCategories.indexOf("Psychologists"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsPsychosIds(newHostsPsychosIds);
          break;
        case "lab technician":
          newHostsLabTechsIds.splice(newHostsLabTechsIds.indexOf(id), 1);
          newHostsCategories.splice(newHostsCategories.indexOf("Lab Techs"), 1);
          sethostsCategories(newHostsCategories);
          setHostsLabTechsIds(newHostsLabTechsIds);
          break;
        case "ultra sound technician":
          newHostsUSTechsIds.splice(newHostsUSTechsIds.indexOf(id), 1);
          newHostsCategories.splice(
            newHostsCategories.indexOf("Ultra Sound Techs"),
            1
          );
          sethostsCategories(newHostsCategories);
          setHostsUSTechsIds(newHostsUSTechsIds);
          break;
        case "other":
          newHostsOthersIds.splice(newHostsOthersIds.indexOf(id), 1);
          newHostsCategories.splice(newHostsCategories.indexOf("Others"), 1);
          sethostsCategories(newHostsCategories);
          setHostsOthersIds(newHostsOthersIds);
          break;
        default:
          break;
      }
    }
    setHostsIds(newHostsIds);
  };

  const handleCheckCategory = async (category, e) => {
    let newHostsCategories = [...hostsCategories];
    let newHostsIds = [...hostsIds];
    const id = e.target.id;

    if (e.target.checked) {
      newHostsCategories = [...newHostsCategories, category];

      //Add all the hosts from the category
      let hostsIdsToAdd = activeStaff
        .filter(({ title }) => title === categoryToTitle(category))
        .filter(({ id }) => !newHostsIds.includes(id))
        .map(({ id }) => id);
      newHostsIds = [...newHostsIds, ...hostsIdsToAdd];
    } else {
      newHostsCategories.splice(newHostsCategories.indexOf(id), 1);
      let hostsIdsToRemove = activeStaff
        .filter(({ title }) => title === categoryToTitle(category))
        .filter(({ id }) => newHostsIds.includes(id))
        .map(({ id }) => id);
      newHostsIds = newHostsIds.filter(
        (staffId) => !hostsIdsToRemove.includes(staffId)
      );
    }
    sethostsCategories(newHostsCategories);
    setHostsIds(newHostsIds);
  };

  //======================== FUNCTIONS =====================//
  const isChecked = (staffId) => (hostsIds.includes(staffId) ? true : false);
  const isCategoryChecked = (category) => {
    return hostsCategories.includes(category) ? true : false;
  };

  return (
    <form className="filter-checkboxes">
      {doctorsLength.current !== 0 && (
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
      {nursesLength.current !== 0 && (
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
      {secretariesLength.current !== 0 && (
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
      {labTechsLength.current !== 0 && (
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
      {usTechsLength.current !== 0 && (
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
      {nutritionistsLength.current !== 0 && (
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
      {psychosLength.current !== 0 && (
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
      {physiosLength.current !== 0 && (
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
      {medStudentsLength.current !== 0 && (
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
      {nursingStudentsLength.current !== 0 && (
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
      {othersLength.current !== 0 && (
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
