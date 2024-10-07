import React, { useState } from "react";
import NewWindow from "react-new-window";
import XmarkIcon from "../../../UI/Icons/XmarkIcon";
import { PamphletType } from "../../../../types/api";

type MessageAttachmentPamphletCardProps = {
  handleRemovePamphlet: (pamphletId: number) => void;
  pamphlet: PamphletType;
  cardWidth?: string;
};

const MessageAttachmentPamphletCard = ({
  handleRemovePamphlet,
  pamphlet,
  cardWidth,
}: MessageAttachmentPamphletCardProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);

  const handleImgClick = () => {
    setPopUpVisible(true);
  };

  return (
    <>
      <div
        className="message__attachment-card"
        style={{ width: cardWidth ?? "" }}
      >
        <div className="message__attachment-card-thumbnail">
          <div>
            <iframe
              id="thumbnail-doc"
              title={pamphlet.name}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                pamphlet.file?.path
              }`}
              width="100%"
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                width: "100%",
                height: "100%",
                opacity: "0",
                cursor: "pointer",
              }}
              onClick={handleImgClick}
            ></div>
          </div>
        </div>
        <div className="message__attachment-card-footer">
          <div className="message__attachment-card-title">
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: "0",
              }}
            >
              {pamphlet.name}
            </p>

            <XmarkIcon onClick={() => handleRemovePamphlet(pamphlet.id)} />
          </div>
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={pamphlet.name}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 600,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          <iframe
            title={pamphlet.name}
            src={`${import.meta.env.VITE_XANO_BASE_URL}${pamphlet.file?.path}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessageAttachmentPamphletCard;
