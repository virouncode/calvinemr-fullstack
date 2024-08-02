import DoctorsFaxNumbers from "./DoctorsFaxNumbers";
import OthersFaxNumbers from "./OthersFaxNumbers";
import PharmaciesFaxNumbers from "./PharmaciesFaxNumbers";

const FaxContacts = ({
  handleClickPharmacy,
  handleClickDoctor,
  handleClickOther,
}) => {
  return (
    <div>
      <PharmaciesFaxNumbers handleClickPharmacy={handleClickPharmacy} />
      <DoctorsFaxNumbers handleClickDoctor={handleClickDoctor} />
      <OthersFaxNumbers handleClickOther={handleClickOther} />
    </div>
  );
};

export default FaxContacts;
