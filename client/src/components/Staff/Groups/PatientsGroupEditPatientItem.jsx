import { Reorder, useDragControls } from "framer-motion";

import { toPatientName } from "../../../utils/names/toPatientName";

const PatientsGroupEditPatientItem = ({
  patient,
  item,
  handleRemovePatient,
  order,
}) => {
  const controls = useDragControls();
  return (
    <Reorder.Item dragListener={false} dragControls={controls} value={item}>
      <div className="patients-groups__card-list-item patients-groups__card-list-item--edit">
        <div>
          {order.indexOf(patient.patient_infos.patient_id) + 1}.{" "}
          {toPatientName(patient.patient_infos)}
        </div>
        <div>
          <i
            className="fa-solid fa-trash"
            onClick={(e) => handleRemovePatient(e, item)}
          />
          <i
            className="fa-solid fa-up-down-left-right"
            style={{ marginLeft: "5px", touchAction: "none" }}
            onPointerDown={(e) => controls.start(e)}
          />
        </div>
      </div>
    </Reorder.Item>
  );
};

export default PatientsGroupEditPatientItem;
