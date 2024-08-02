

const EmptyRow = ({ colSpan, text }) => {
  return (
    <tr className="empty-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        {text}
      </td>
    </tr>
  );
};

export default EmptyRow;
