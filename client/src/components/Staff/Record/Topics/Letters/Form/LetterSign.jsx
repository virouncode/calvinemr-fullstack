
import useUserContext from "../../../../../../hooks/context/useUserContext";

const LetterSign = () => {
  const { user } = useUserContext();
  return (
    <div className="letter__sign">
      {user.sign?.url && (
        <div className="letter__sign-image">
          <img src={user.sign?.url} alt="doctor-sign" crossOrigin="Anonymous" />
        </div>
      )}
    </div>
  );
};

export default LetterSign;
