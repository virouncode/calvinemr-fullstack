
import CircularProgressSmall from "../Progress/CircularProgressSmall";

const LoadingRow = ({ colSpan }) => {
  return (
    <tr className="loading-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        Loading...
        <CircularProgressSmall />
      </td>
    </tr>
  );
};

export default LoadingRow;
