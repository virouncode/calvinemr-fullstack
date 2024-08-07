import avatarLogo from "../../../assets/img/avatar.png";
import CameraIcon from "../../UI/Icons/CameraIcon";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

const PatientAvatarInput = ({
  formDatas,
  setWebcamVisible,
  isLoadingFile,
  handleAvatarChange,
}) => {
  return (
    <>
      <label htmlFor="avatar">Avatar: </label>
      <div className="signup-patient__image">
        <div className="signup-patient__image-preview">
          <div className="signup-patient__image-preview-square">
            {formDatas.avatar ? (
              <img
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  formDatas.avatar?.path
                }`}
                alt="avatar"
              />
            ) : (
              <img src={avatarLogo} alt="user-avatar-placeholder" />
            )}
          </div>
          <CameraIcon onClick={() => setWebcamVisible((v) => !v)} />
          {isLoadingFile && <CircularProgressSmall />}
        </div>
        <div className="signup-patient__image-options">
          <input
            name="avatar"
            type="file"
            accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
            onChange={handleAvatarChange}
            id="avatar"
          />
        </div>
      </div>
    </>
  );
};

export default PatientAvatarInput;
