import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import ContactsForPatientCategory from "./ContactsForPatientCategory";

const ContactsForPatient = ({ isContactChecked, handleCheckContact }) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const doctorsInfos = {
    name: "Doctors",
    infos: activeStaff
      .filter(({ title }) => title === "Doctor")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const medStudentsInfos = {
    name: "Medical Students",
    infos: activeStaff
      .filter(({ title }) => title === "Medical Student")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const nursesInfos = {
    name: "Nurses",
    infos: activeStaff
      .filter(({ title }) => title === "Nurse")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const nursingStudentsInfos = {
    name: "Nursing Students",
    infos: activeStaff
      .filter(({ title }) => title === "Nursing Student")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const secretariesInfos = {
    name: "Secretaries",
    infos: activeStaff.filter(({ title }) => title === "Secretary"),
  };
  const ultrasoundInfos = {
    name: "Ultra Sound Techs",
    infos: activeStaff
      .filter(({ title }) => title === "Ultra Sound Technician")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const labTechInfos = {
    name: "Lab Techs",
    infos: activeStaff
      .filter(({ title }) => title === "Lab Technician")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const nutritionistInfos = {
    name: "Nutritionists",
    infos: activeStaff
      .filter(({ title }) => title === "Nutritionist")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const physiosInfos = {
    name: "Physiotherapists",
    infos: activeStaff
      .filter(({ title }) => title === "Physiotherapist")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const psychosInfos = {
    name: "Psychologists",
    infos: activeStaff
      .filter(({ title }) => title === "Psychologist")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
  };
  const othersInfos = {
    name: "Others",
    infos: activeStaff
      .filter(({ title }) => title === "Other")
      .filter(({ staff_settings }) =>
        staff_settings.authorized_messages_patients_ids.includes(user.id)
      ),
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
      <div className="contacts__lists">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <ContactsForPatientCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
              key={category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default ContactsForPatient;
