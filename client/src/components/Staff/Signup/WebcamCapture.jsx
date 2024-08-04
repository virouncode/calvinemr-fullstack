import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import xanoPost from "../../../api/xanoCRUD/xanoPost";

const WebcamCapture = ({ setFormDatas, setWebcamVisible }) => {
  const [imgSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  const handleConfirm = async () => {
    const fileToUpload = await xanoPost("/upload/attachment", "staff", {
      content: imgSrc,
    });
    setFormDatas((old) => {
      return {
        ...old,
        avatar: fileToUpload,
      };
    });
    setWebcamVisible(false);
  };

  const handleTake = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef, setImageSrc]);

  const handleRetake = () => {
    setImageSrc(null);
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
          <button onClick={handleRetake}>Retake photo</button>
        ) : (
          <button onClick={handleTake} className="save-btn">
            Capture photo
          </button>
        )}
        {imgSrc && (
          <button onClick={handleConfirm} className="save-btn">
            OK
          </button>
        )}
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default WebcamCapture;
