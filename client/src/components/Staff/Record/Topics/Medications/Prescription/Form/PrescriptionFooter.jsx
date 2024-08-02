

const PrescriptionFooter = ({ uniqueId }) => {
  return (
    <div className="prescription__footer">
      {uniqueId && <p className="prescription__id">ID: {uniqueId}</p>}
    </div>
  );
};

export default PrescriptionFooter;
