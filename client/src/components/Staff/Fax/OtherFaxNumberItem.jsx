const OtherFaxNumberItem = ({
  other,
  handleClickOther,
  lastItemRef = null,
}) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={(e) => handleClickOther(e, other)}
    >
      {other.name}, {other.category}
    </li>
  );
};

export default OtherFaxNumberItem;
