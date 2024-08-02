
import EmptyLi from "../../UI/Lists/EmptyLi";
import PatientsGroupItem from "./PatientsGroupItem";

const PatientsGroupCardContent = ({ group }) => {
  const patients = group.patients;
  const order = group.patients.map(
    ({ patient_infos }) => patient_infos.patient_id
  );
  return (
    <div className="patients-groups__card-content">
      <div className="patients-groups__card-description">
        {group.description}
      </div>
      <div className="patients-groups__card-list">
        <ul>
          {order.length > 0 ? (
            order.map((item, index) => (
              <PatientsGroupItem
                patient={patients.find(
                  ({ patient_infos }) => patient_infos.patient_id === item
                )}
                key={item}
                index={index}
              />
            ))
          ) : (
            <EmptyLi text="No patients in this group" paddingLateral={5} />
          )}
        </ul>
      </div>
    </div>
  );
};

export default PatientsGroupCardContent;
