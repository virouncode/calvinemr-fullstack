

const EmptyRow = ({ colSpan, errorMsg }) => {
  return (
    <tr className="empty-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        {errorMsg}
      </td>
    </tr>
  );
};

export default EmptyRow;
