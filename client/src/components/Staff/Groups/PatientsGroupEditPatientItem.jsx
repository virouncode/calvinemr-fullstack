import { Reorder, useDragControls } from "framer-motion";

import { toPatientName } from "../../../utils/names/toPatientName";
import CrossArrowIcon from "../../UI/Icons/CrossArrowIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

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
          <TrashIcon onClick={(e) => handleRemovePatient(e, item)} />
          <CrossArrowIcon ml={5} onPointerDown={(e) => controls.start(e)} />
        </div>
      </div>
    </Reorder.Item>
  );
};

export default PatientsGroupEditPatientItem;
