

const AddedMedItem = ({ med, addedMeds, setAddedMeds }) => {
  const handleRemoveFromRx = (e) => {
    e.stopPropagation();
    setAddedMeds(addedMeds.filter(({ temp_id }) => temp_id !== med.temp_id));
  };

  const handleChangeItemInstruction = (e) => {
    const value = e.target.value;
    setAddedMeds(
      addedMeds.map((addedMed) => {
        return addedMed.temp_id === med.temp_id
          ? { ...addedMed, PrescriptionInstructions: value }
          : addedMed;
      })
    );
  };

  return (
    <li className="prescription__item">
      <div>
        <textarea
          className="prescription__item-textarea"
          value={med.PrescriptionInstructions}
          onChange={handleChangeItemInstruction}
        />
        <div style={{ textAlign: "end" }}>
          <i
            className="fa-solid fa-trash"
            style={{ cursor: "pointer" }}
            onClick={handleRemoveFromRx}
          />
        </div>
      </div>
    </li>
  );
};

export default AddedMedItem;
