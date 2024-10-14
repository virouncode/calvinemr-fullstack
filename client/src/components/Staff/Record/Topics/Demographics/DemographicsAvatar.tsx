import React from "react";
import avatarPlaceholder from "../../../../../assets/img/avatar.png";
import { AttachmentType } from "../../../../../types/api";
import CameraIcon from "../../../../UI/Icons/CameraIcon";

type DemographicsAvatarProps = {
  avatar: AttachmentType | null;
  editVisible: boolean;
  setWebcamVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const DemographicsAvatar = ({
  avatar,
  editVisible,
  setWebcamVisible,
  handleAvatarChange,
}: DemographicsAvatarProps) => {
  return (
    <div className="demographics-card__image">
      <div className="demographics-card__image-preview">
        <div className="demographics-card__image-preview-square">
          {avatar ? (
            <img
              src={`${import.meta.env.VITE_XANO_BASE_URL}${avatar.path}`}
              alt="user-avatar"
            />
          ) : (
            <img src={avatarPlaceholder} alt="user-avatar-placeholder" />
          )}
        </div>
        {editVisible && (
          <CameraIcon onClick={() => setWebcamVisible((v) => !v)} />
        )}
      </div>
      {editVisible && (
        <div className="signup-patient__image-options">
          <p>Choose a picture</p>
          <input
            name="avatar"
            type="file"
            accept=".jpeg, .jpg, .png, .pdf"
            onChange={handleAvatarChange}
          />
        </div>
      )}
    </div>
  );
};

export default DemographicsAvatar;
