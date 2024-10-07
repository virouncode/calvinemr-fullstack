import React, { useState } from "react";
import NewWindow from "react-new-window";
import { EdocType } from "../../../../types/api";
import XmarkIcon from "../../../UI/Icons/XmarkIcon";

type MessageAttachmentEdocCardProps = {
  handleRemoveEdoc: (edocId: number) => void;
  edoc: EdocType;
  cardWidth?: string;
};

const MessageAttachmentEdocCard = ({
  handleRemoveEdoc,
  edoc,
  cardWidth,
}: MessageAttachmentEdocCardProps) => {
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
              title={edoc.name}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${edoc.file?.path}`}
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
              {edoc.name}
            </p>

            <XmarkIcon onClick={() => handleRemoveEdoc(edoc.id)} />
          </div>
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={edoc.name}
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
            title={edoc.name}
            src={`${import.meta.env.VITE_XANO_BASE_URL}${edoc.file?.path}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessageAttachmentEdocCard;
