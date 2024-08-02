

const EmptyLi = ({ text, paddingLateral = 0 }) => {
  return (
    <li
      style={{ padding: `0 ${paddingLateral}px`, fontWeight: "bold" }}
      className="empty-li"
    >
      {text}
    </li>
  );
};

export default EmptyLi;
