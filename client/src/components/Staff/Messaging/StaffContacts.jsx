import StaffContactsCategory from "./StaffContactsCategory";

const StaffContacts = ({
  staffInfos,
  handleCheckContact,
  isContactChecked,
  handleCheckCategory,
  isCategoryChecked,
  visibleCategory = "",
}) => {
  console.log(visibleCategory);
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const doctorsInfos = {
    name: "Doctors",
    infos: activeStaff.filter(({ title }) => title === "Doctor"),
  };
  const medStudentsInfos = {
    name: "Medical Students",
    infos: activeStaff.filter(({ title }) => title === "Medical Student"),
  };
  const nursesInfos = {
    name: "Nurses",
    infos: activeStaff.filter(({ title }) => title === "Nurse"),
  };
  const nursingStudentsInfos = {
    name: "Nursing Students",
    infos: activeStaff.filter(({ title }) => title === "Nursing Student"),
  };
  const secretariesInfos = {
    name: "Secretaries",
    infos: activeStaff.filter(({ title }) => title === "Secretary"),
  };
  const ultrasoundInfos = {
    name: "Ultra Sound Techs",
    infos: activeStaff.filter(
      ({ title }) => title === "Ultra Sound Technician"
    ),
  };
  const labTechInfos = {
    name: "Lab Techs",
    infos: activeStaff.filter(({ title }) => title === "Lab Technician"),
  };
  const nutritionistInfos = {
    name: "Nutritionists",
    infos: activeStaff.filter(({ title }) => title === "Nutritionist"),
  };
  const physiosInfos = {
    name: "Physiotherapists",
    infos: activeStaff.filter(({ title }) => title === "Physiotherapist"),
  };
  const psychosInfos = {
    name: "Psychologists",
    infos: activeStaff.filter(({ title }) => title === "Psychologist"),
  };
  const othersInfos = {
    name: "Others",
    infos: activeStaff.filter(({ title }) => title === "Other"),
  };

  const allInfos = [
    doctorsInfos,
    medStudentsInfos,
    nursesInfos,
    nursingStudentsInfos,
    secretariesInfos,
    ultrasoundInfos,
    labTechInfos,
    nutritionistInfos,
    physiosInfos,
    psychosInfos,
    othersInfos,
  ];

  return (
    <div className="contacts">
      <div className="contacts__title">Recipients</div>
      <div className="contacts__list">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <StaffContactsCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
              handleCheckCategory={handleCheckCategory}
              isCategoryChecked={isCategoryChecked}
              key={category.name}
              initiallyVisible={category.name === visibleCategory}
            />
          ))}
      </div>
    </div>
  );
};

export default StaffContacts;
