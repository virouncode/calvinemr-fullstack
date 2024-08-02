const DoctorFaxNumberItem = ({
  doctor,
  handleClickDoctor,
  lastItemRef = null,
}) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={(e) => handleClickDoctor(e, doctor)}
    >
      {doctor.LastName ? `${doctor.LastName}, ` : ""}
      {doctor.FirstName ? `${doctor.FirstName}, ` : ""}
      {doctor.speciality}
    </li>
  );
};

export default DoctorFaxNumberItem;
