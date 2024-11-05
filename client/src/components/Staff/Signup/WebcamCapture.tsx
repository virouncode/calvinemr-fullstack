import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { DemographicsFormType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";

type WebcamCaptureProps = {
  setFormDatas: React.Dispatch<
    React.SetStateAction<Partial<DemographicsFormType>>
  >;
  setWebcamVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const WebcamCapture = ({
  setFormDatas,
  setWebcamVisible,
}: WebcamCaptureProps) => {
  const [imgSrc, setImageSrc] = useState("");
  const webcamRef = useRef<Webcam | null>(null);

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("content", imgSrc);
    try {
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload = response.data;
      setFormDatas((old) => {
        return {
          ...(old as Partial<DemographicsFormType>),
          avatar: fileToUpload,
        };
      });
      setWebcamVisible(false);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "A",
        });
      }
      setWebcamVisible(false);
    }
  };

  const handleTake = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImageSrc(imageSrc);
  }, [webcamRef, setImageSrc]);

  const handleRetake = () => {
    setImageSrc("");
  };

  const handleCancel = () => {
    setWebcamVisible(false);
  };

  return (
    <div className="webcam">
      <div className="webcam__image">
        {imgSrc ? (
          <img src={imgSrc} alt="avatar-webcam" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={400}
            videoConstraints={{ width: 400, height: 400, facingMode: "user" }}
            mirrored={true}
            screenshotQuality={1}
          />
        )}
      </div>
      <div className="webcam__btn-container">
        {imgSrc ? (
          <Button onClick={handleRetake} label="Retake photo" />
        ) : (
          <Button onClick={handleTake} label="Capture photo" />
        )}
        {imgSrc && <SaveButton onClick={handleConfirm} label="OK" />}
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default WebcamCapture;
