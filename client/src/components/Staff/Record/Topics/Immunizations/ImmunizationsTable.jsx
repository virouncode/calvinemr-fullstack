import { useState } from "react";
import Button from "../../../../UI/Buttons/Button";
import ImmunizationForm from "./ImmunizationForm";
import ImmunizationItem from "./ImmunizationItem";

const ImmunizationsTable = ({
  datas,
  errMsgPost,
  setErrMsgPost,
  patientId,
  editCounter,
  topicPost,
  topicPut,
  topicDelete,
}) => {
  const [addVisible, setAddVisible] = useState(false);

  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };
  return (
    <>
      <div className="immunizations__table-container">
        <table className="immunizations__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Immunization type</th>
              <th>Immunization brand name</th>
              <th>Manufacturer</th>
              <th>Lot#</th>
              <th>Route</th>
              <th>Site</th>
              <th>Dose</th>
              <th>Date</th>
              <th>Refused</th>
              <th>Instructions</th>
              <th>Notes</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <ImmunizationForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                patientId={patientId}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                topicPost={topicPost}
              />
            )}
            {datas.map((item) => (
              <ImmunizationItem
                key={item.id}
                item={item}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                editCounter={editCounter}
                topicPut={topicPut}
                topicDelete={topicDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="immunizations__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
      </div>
    </>
  );
};

export default ImmunizationsTable;
