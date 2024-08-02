
import AddedMedItem from "./AddedMedItem";

const AddedMedsList = ({ addedMeds, setAddedMeds, body }) => {
  return (
    <ul className="prescription__list">
      {addedMeds.map((med) => (
        <AddedMedItem
          med={med}
          setAddedMeds={setAddedMeds}
          addedMeds={addedMeds}
          key={med.temp_id}
        />
      ))}
    </ul>
  );
};

export default AddedMedsList;
