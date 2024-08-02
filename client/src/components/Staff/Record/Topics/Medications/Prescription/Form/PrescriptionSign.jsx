
import useUserContext from "../../../../../../../hooks/context/useUserContext";

const PrescriptionSign = () => {
  const { user } = useUserContext();
  return (
    <div className="prescription__sign">
      {user.sign?.url && (
        <div className="prescription__sign-image">
          <img src={user.sign?.url} alt="doctor-sign" crossOrigin="Anonymous" />
        </div>
      )}
    </div>
  );
};

export default PrescriptionSign;
