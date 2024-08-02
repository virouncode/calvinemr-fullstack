const PharmacyFaxNumberItem = ({
  pharmacy,
  handleClickPharmacy,
  lastItemRef = null,
}) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={(e) => handleClickPharmacy(e, pharmacy)}
    >
      {pharmacy.Name}
    </li>
  );
};

export default PharmacyFaxNumberItem;
