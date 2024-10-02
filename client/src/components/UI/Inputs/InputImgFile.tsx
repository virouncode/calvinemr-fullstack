import React from "react";
import { AttachmentType } from "../../../types/api";
import CircularProgressMedium from "../Progress/CircularProgressMedium";

type InputImgFileProps = {
  isLoadingFile: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  img: AttachmentType | null;
  alt: string;
  width: number;
  placeholderText: string;
};

const InputImgFile = ({
  isLoadingFile,
  onChange,
  img,
  alt,
  width,
  placeholderText,
}: InputImgFileProps) => {
  console.log("img", img);

  return (
    <>
      {isLoadingFile ? (
        <CircularProgressMedium />
      ) : img ? (
        <img
          src={`${import.meta.env.VITE_XANO_BASE_URL}${img?.path}`}
          alt={alt}
          width={`${width}px`}
        />
      ) : (
        <img
          src={`https://placehold.co/200x100/png?font=roboto&text=${placeholderText}`}
          alt="logo-placeholder"
        />
      )}
      <input
        name="logo"
        type="file"
        accept=".jpeg, .jpg, .png, .tif, .svg"
        onChange={onChange}
      />
    </>
  );
};

export default InputImgFile;
